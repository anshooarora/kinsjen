package com.aventstack.kinsjen.api.external.jenkins.conn;

import com.aventstack.kinsjen.api.credential.Credential;
import com.aventstack.kinsjen.api.jenkinsinstance.JenkinsInstance;
import lombok.Data;

@Data
public class JenkinsInstanceCredential {

    private JenkinsInstance jenkinsInstance;
    private Credential credential;

}
