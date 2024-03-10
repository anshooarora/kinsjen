package com.aventstack.kinsjen.api.external.jenkins.conn;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/external/jenkins/connection")
public class JenkinsConnectionController {

    @Autowired
    private JenkinsConnectionService service;

    @PostMapping
    public ResponseEntity<ConnectionTestResponse> testConnection(@RequestBody final JenkinsInstanceCredential jenkinsInstanceCredential) {
        final ConnectionTestResponse response = service.testConnection(jenkinsInstanceCredential);
        if (response.isValid()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

}
