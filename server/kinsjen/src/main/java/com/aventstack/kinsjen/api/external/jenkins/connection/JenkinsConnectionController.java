package com.aventstack.kinsjen.api.external.jenkins.connection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/external/jenkins/connection")
public class JenkinsConnectionController {

    @Autowired
    private JenkinsConnectionService service;

    @PostMapping
    public ResponseEntity<ConnectionTestResponse> testConnection(@Valid @RequestBody final JenkinsInstanceCredential jenkinsInstanceCredential) {
        final ConnectionTestResponse connectionTestResponse = service.testConnection(jenkinsInstanceCredential);
        if (connectionTestResponse.isValid()) {
            return ResponseEntity.ok(connectionTestResponse);
        }
        return ResponseEntity.badRequest().body(connectionTestResponse);
    }

}
