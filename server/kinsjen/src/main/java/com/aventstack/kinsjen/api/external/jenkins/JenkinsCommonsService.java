package com.aventstack.kinsjen.api.external.jenkins;

import com.aventstack.kinsjen.api.credential.Credential;
import com.aventstack.kinsjen.api.credential.CredentialNotFoundException;
import com.aventstack.kinsjen.api.credential.CredentialService;
import com.aventstack.kinsjen.api.jenkinsinstance.JenkinsInstance;
import com.aventstack.kinsjen.api.jenkinsinstance.JenkinsInstanceNotFoundException;
import com.aventstack.kinsjen.api.jenkinsinstance.JenkinsInstanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JenkinsCommonsService {

    @Autowired
    private JenkinsInstanceService jenkinsInstanceService;

    @Autowired
    private CredentialService credentialService;

    public JenkinsInstance findInstance(final long jenkinsInstanceId) {
        return jenkinsInstanceService.findById(jenkinsInstanceId)
                .orElseThrow(() -> new JenkinsInstanceNotFoundException("Unknown Jenkins instance ID " + jenkinsInstanceId));
    }

    public Credential findCredential(final long credentialId) {
        return credentialService.findById(credentialId)
                .orElseThrow(() -> new CredentialNotFoundException("Unknown Credential ID " + credentialId));
    }

}
