package com.aventstack.kinsjen.api.external.jenkins.conn;

import com.aventstack.kinsjen.api.credential.Credential;
import com.aventstack.kinsjen.api.external.jenkins.JenkinsURIPath;
import com.aventstack.kinsjen.api.jenkinsinstance.JenkinsInstance;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class JenkinsConnectionService {

    @Autowired
    private RestTemplate restTemplate;

    public ConnectionTestResponse testConnection(final JenkinsInstanceCredential jenkinsInstanceCredential) {
        final JenkinsInstance jenkinsInstance = jenkinsInstanceCredential.getJenkinsInstance();
        final Credential credential = jenkinsInstanceCredential.getCredential();

        final HttpHeaders headers = new HttpHeaders();
        if (null != credential
                && !StringUtils.isBlank(credential.getName())
                && !StringUtils.isBlank(credential.getUsername())
                && !StringUtils.isBlank(credential.getApiToken())) {
            headers.setBasicAuth(credential.getUsername(), credential.getApiToken());
        }

        final ConnectionTestResponse response = new ConnectionTestResponse();
        try {
            final ResponseEntity<JenkinsBaseResponse> responseEntity = restTemplate.exchange(
                    jenkinsInstance.getUrl() + "/" + JenkinsURIPath.API,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    JenkinsBaseResponse.class);
            final boolean valid = HttpStatus.OK == responseEntity.getStatusCode()
                    && responseEntity.hasBody()
                    && !StringUtils.isBlank(responseEntity.getBody().get_class());
            response.setValid(valid);
        } catch (final Throwable t) {
            response.setError(t.getMessage());
        }
        return response;
    }

}
