package com.aventstack.kinsjen.api.external.jenkins.testreport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/external/jenkins/testReports")
public class JenkinsTestReportController {

    @Autowired
    private JenkinsTestReportService service;

    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam(defaultValue = "-1") final int jenkinsInstanceId,
            @RequestParam(defaultValue = "-1") final int credentialId) {
        if (0 >= jenkinsInstanceId) {
            return ResponseEntity.badRequest().body("Invalid Jenkins instance ID specified: " + jenkinsInstanceId);
        }
        return ResponseEntity.ok(null);
    }

}
