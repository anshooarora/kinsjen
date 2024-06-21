package com.aventstack.kinsjen.api.external.jenkins.job;

import com.aventstack.kinsjen.api.credential.Credential;
import com.aventstack.kinsjen.api.credential.CredentialService;
import com.aventstack.kinsjen.api.external.jenkins.JenkinsPath;
import com.aventstack.kinsjen.api.external.jenkins.JenkinsCommonsService;
import com.aventstack.kinsjen.api.jenkinsinstance.JenkinsInstance;
import com.aventstack.kinsjen.api.pipeline.Pipeline;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JenkinsJobService {

    private static final Logger log = LoggerFactory.getLogger(JenkinsJobService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private JenkinsCommonsService jenkinsCommonsService;

    @Autowired
    private CredentialService credentialService;

    public List<Job> findAllJobs(final int jenkinsInstanceId,
                                 final int credentialId,
                                 final int depth,
                                 final boolean recursive) throws MalformedURLException {
        final JenkinsInstance jenkinsInstance = jenkinsCommonsService.findInstance(jenkinsInstanceId);
        final Optional<Credential> credential = credentialService.findById(credentialId);
        return findAllJobs(jenkinsInstance, credential, depth, recursive);
    }

    @SuppressWarnings("OptionalUsedAsFieldOrParameterType")
    public List<Job> findAllJobs(final JenkinsInstance jenkinsInstance,
                                 final Optional<Credential> cred,
                                 final int depth,
                                 final boolean recursive) throws MalformedURLException {
        final HttpHeaders headers = new HttpHeaders();
        cred.ifPresent(value -> headers.setBasicAuth(value.getUsername(), value.getApiToken()));
        return findJobs(jenkinsInstance.getUrl(), headers, new ArrayList<>(), depth, recursive);
    }

    private List<Job> findJobs(final String baseUrl,
                               final HttpHeaders headers,
                               final List<Job> jobs,
                               final int depth,
                               final boolean recurse) throws MalformedURLException {
        log.debug("Retrieving job listing from URL " + baseUrl);
        final String url = baseUrl + JenkinsPath.API_JSON + "?depth=" + depth;
        final ResponseEntity<JobListingEntity> responseEntity = restTemplate.exchange(url, HttpMethod.GET,
                new HttpEntity<>(headers), JobListingEntity.class);
        final JobListingEntity jobListing = responseEntity.getBody();

        // to circumvent the issue where kinsjen runs from within docker on the same host as Jenkins:
        // we will use the same host (host.docker.internal) instead of http://localhost
        // More info here: https://docs.docker.com/desktop/networking/#use-cases-and-workarounds
        if (baseUrl.contains("host.docker.internal") && null != jobListing && null != jobListing.getJobs()) {
            log.info("Replacing host information with host.docker.internal");
            for (final Job job : jobListing.getJobs()) {
                updateUriString(baseUrl, job);
            }
            log.info("Updated host information for jobListing " + jobs);
        } else {
            log.debug("Found jobs: " + jobListing);
        }

        if (null != jobListing) {
            final List<Job> folders = jobListing.getJobs().stream()
                    .filter(Job::isFolder)
                    .collect(Collectors.toUnmodifiableList());
            final List<Job> jobList = jobListing.getJobs().stream()
                    .filter(Job::isJob)
                    .collect(Collectors.toUnmodifiableList());
            jobs.addAll(jobList);

            if (recurse) {
                for (final Job job : folders) {
                    return findJobs(job.getUrl(), headers, jobs, depth, true);
                }
            }
        }

        return jobs;
    }

    private void updateUriString(final String baseUrl, final Job job) throws MalformedURLException {
        final URL baseURL = new URL(baseUrl);
        final UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(job.getUrl());
        job.setUrl(builder.host(baseURL.getHost()).port(baseURL.getPort()).toUriString());
    }

    public Job findJob(final Pipeline pipeline, final int depth) {
        final String uri = pipeline.getUrl() + JenkinsPath.API_JSON;
        final String url = JenkinsPath.withDepth(depth, uri);
        final HttpHeaders headers = new HttpHeaders();

        if (0 < pipeline.getCredentialId()) {
            final Optional<Credential> cred = credentialService.findById(pipeline.getCredentialId());
            cred.ifPresent(value -> headers.setBasicAuth(value.getUsername(), value.getApiToken()));
        }

        final ResponseEntity<Job> responseEntity = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), Job.class);
        return responseEntity.getBody();
    }

}
