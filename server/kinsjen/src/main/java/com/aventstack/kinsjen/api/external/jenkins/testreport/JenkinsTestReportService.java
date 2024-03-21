package com.aventstack.kinsjen.api.external.jenkins.testreport;

import com.aventstack.kinsjen.api.credential.Credential;
import com.aventstack.kinsjen.api.credential.CredentialService;
import com.aventstack.kinsjen.api.external.jenkins.JenkinsPath;
import com.aventstack.kinsjen.api.external.jenkins.job.Job;
import com.aventstack.kinsjen.api.pipeline.Pipeline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Service
public class JenkinsTestReportService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private CredentialService credentialService;

    public TestReportEntity findTestReport(final Pipeline pipeline, final int buildId) {
        final String url = pipeline.getUrl() + "/" + buildId + JenkinsPath.TEST_REPORT;
        final HttpHeaders headers = new HttpHeaders();

        if (0 < pipeline.getCredentialId()) {
            final Optional<Credential> cred = credentialService.findById(pipeline.getCredentialId());
            cred.ifPresent(value -> headers.setBasicAuth(value.getUsername(), value.getApiToken()));
        }

        final ResponseEntity<TestReportEntity> responseEntity = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), TestReportEntity.class);
        return responseEntity.getBody();
    }
}
