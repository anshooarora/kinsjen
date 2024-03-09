package com.aventstack.kinsjen.api.external.jenkins.job;

import com.aventstack.kinsjen.api.credential.Credential;
import com.aventstack.kinsjen.api.credential.CredentialNotFoundException;
import com.aventstack.kinsjen.api.credential.CredentialService;
import com.aventstack.kinsjen.api.external.jenkins.JenkinsURIPath;
import com.aventstack.kinsjen.api.jenkinsinstance.JenkinsInstance;
import com.aventstack.kinsjen.api.jenkinsinstance.JenkinsInstanceNotFoundException;
import com.aventstack.kinsjen.api.jenkinsinstance.JenkinsInstanceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JenkinsJobService {

    private static final Logger log = LoggerFactory.getLogger(JenkinsJobService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private JenkinsInstanceService jenkinsInstanceService;

    @Autowired
    private CredentialService credentialService;

    public List<Job> findAllJobs(final int jenkinsInstanceId, final int credentialId, final boolean recursive) {
        final JenkinsInstance jenkinsInstance = jenkinsInstanceService.findById(jenkinsInstanceId)
                .orElseThrow(() -> new JenkinsInstanceNotFoundException("Unknown Jenkins instance ID " + jenkinsInstanceId));
        final Credential credential = credentialService.findById(credentialId)
                .orElseThrow(() -> new CredentialNotFoundException("Unknown Credential ID " + credentialId));
        return findAllJobs(jenkinsInstance, credential, recursive);
    }

    public List<Job> findAllJobs(final JenkinsInstance jenkinsInstance, final Credential credential, final boolean recursive) {
        final HttpHeaders headers = new HttpHeaders();
        //headers.setBasicAuth("anshoo", "11aa31fbf6109218aefc691b1546f6ce4c");
        headers.setBasicAuth(credential.getUsername(), credential.getApiToken());
        return findJobs(jenkinsInstance.getUrl(), headers, new ArrayList<>(), recursive);
    }

    private List<Job> findJobs(final String url, final HttpHeaders headers, final List<Job> jobs, final boolean recurse) {
        log.debug("Retrieving job listing from URL " + url);
        final ResponseEntity<JobListingEntity> responseEntity = restTemplate.exchange(url + "/" + JenkinsURIPath.API,
                HttpMethod.GET, new HttpEntity<>(headers), JobListingEntity.class);
        final JobListingEntity jobListing = responseEntity.getBody();
        log.debug("Found jobs: " + jobListing);
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
                    return findJobs(job.getUrl(), headers, jobs, true);
                }
            }
        }
        return jobs;
    }

}
