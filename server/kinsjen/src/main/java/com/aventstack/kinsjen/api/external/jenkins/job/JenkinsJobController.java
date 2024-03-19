package com.aventstack.kinsjen.api.external.jenkins.job;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/external/jenkins/jobs")
public class JenkinsJobController {

    @Autowired
    private JenkinsJobService service;

    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam(defaultValue = "-1") final int jenkinsInstanceId,
            @RequestParam(defaultValue = "-1") final int credentialId,
            @RequestParam(defaultValue = "false") final boolean recursive) {
        if (0 >= jenkinsInstanceId) {
            return ResponseEntity.badRequest().body("Invalid Jenkins instance ID specified: " + jenkinsInstanceId);
        }
        return ResponseEntity.ok(service.findAllJobs(jenkinsInstanceId, credentialId, recursive));
    }

}
