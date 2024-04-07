package com.aventstack.kinsjen.api.external.jenkins.connection;

import com.aventstack.kinsjen.api.credential.Credential;
import com.aventstack.kinsjen.api.external.jenkins.JenkinsPath;
import com.aventstack.kinsjen.api.jenkinsinstance.JenkinsInstance;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Objects;

@Service
public class JenkinsConnectionService {

    private static final Logger log = LoggerFactory.getLogger(JenkinsConnectionService.class);
    private static final String TREE = "?tree=_class,mode,nodeName,nodeDescription,numExecutors,useSecurity";

    @Autowired
    private RestTemplate restTemplate;

    public ConnectionTestResponse testConnection(final JenkinsInstanceCredential jenkinsInstanceCredential) {
        final JenkinsInstance jenkinsInstance = jenkinsInstanceCredential.getJenkinsInstance();
        log.info("Testing Jenkins instance connection: " + jenkinsInstance.getName() + " -> " + jenkinsInstance.getUrl());
        final Credential credential = jenkinsInstanceCredential.getCredential();

        final HttpHeaders headers = new HttpHeaders();
        if (null != credential
                && !StringUtils.isBlank(credential.getName())
                && !StringUtils.isBlank(credential.getUsername())
                && !StringUtils.isBlank(credential.getApiToken())) {
            log.info("Instance '" + jenkinsInstance.getName() + "' requires basic auth, adding auth info header");
            headers.setBasicAuth(credential.getUsername(), credential.getApiToken());
        }

        final ConnectionTestResponse response = new ConnectionTestResponse();
        try {
            final String url = jenkinsInstance.getUrl() + JenkinsPath.API_JSON + TREE;
            final ResponseEntity<JenkinsBaseResponse> responseEntity = restTemplate.exchange(url, HttpMethod.GET,
                    new HttpEntity<>(headers), JenkinsBaseResponse.class);
            final boolean valid = HttpStatus.OK == responseEntity.getStatusCode()
                    && responseEntity.hasBody()
                    && !StringUtils.isBlank(Objects.requireNonNull(responseEntity.getBody()).get_class());
            response.setValid(valid);
        } catch (final HttpClientErrorException e) {
            response.setStatusCode(e.getStatusCode());
            response.setStatusText(e.getStatusText());
            response.setError(e.getMessage());
        } catch (final Throwable t) {
            response.setError(t.getMessage());
        }
        return response;
    }

}
