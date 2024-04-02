package com.aventstack.kinsjen.api.external.jenkins.consolelogs;

import com.aventstack.kinsjen.api.credential.Credential;
import com.aventstack.kinsjen.api.credential.CredentialService;
import com.aventstack.kinsjen.api.external.jenkins.JenkinsPath;
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

import java.util.Optional;

@Service
public class JenkinsConsoleLogsService {

    private static final Logger log = LoggerFactory.getLogger(JenkinsConsoleLogsService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private CredentialService credentialService;

    public String findConsoleText(final Pipeline pipeline, final int buildNumber) {
        final String url = pipeline.getUrl() + "/" + buildNumber + JenkinsPath.CONSOLE_TEXT;
        final HttpHeaders headers = new HttpHeaders();

        if (0 < pipeline.getCredentialId()) {
            final Optional<Credential> cred = credentialService.findById(pipeline.getCredentialId());
            cred.ifPresent(value -> headers.setBasicAuth(value.getUsername(), value.getApiToken()));
        }

        final ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), String.class);
        return responseEntity.getBody();
    }

}
