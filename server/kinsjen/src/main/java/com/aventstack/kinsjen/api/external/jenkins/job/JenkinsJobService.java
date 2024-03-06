package com.aventstack.kinsjen.api.external.jenkins.job;

import com.aventstack.kinsjen.api.external.jenkins.JenkinsURIPath;
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

    public List<Job> findAllJobs(final String baseURI, final boolean recursive) {
        return findJobs(baseURI, new ArrayList<>(), recursive);
    }

    private List<Job> findJobs(final String url, final List<Job> jobs, final boolean recurse) {
        log.debug("Retrieving job listing from URL " + url);

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth("anshoo", "11aa31fbf6109218aefc691b1546f6ce4c");

        final ResponseEntity<JobListingEntity> responseEntity = restTemplate.exchange(url + JenkinsURIPath.API,
                HttpMethod.GET, new HttpEntity<>(headers), JobListingEntity.class);
        final JobListingEntity jobListing = responseEntity.getBody();
        log.debug("Found jobs: " + jobListing);
        if (null != jobListing) {
            final List<Job> folders = jobListing.getJobs().stream()
                    .filter(Job::isFolder)
                    .collect(Collectors.toUnmodifiableList());
            final List<Job> jobList = jobListing.getJobs().stream()
                    .filter(Job::isJob)
                    .collect(Collectors.toList());
            jobs.addAll(jobList);
            if (recurse) {
                for (final Job job : folders) {
                    return findJobs(job.getUrl(), jobs, true);
                }
            }
        }
        return jobs;
    }

}
