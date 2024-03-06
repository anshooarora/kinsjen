package com.aventstack.kinsjen.api.external.jenkins.job;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/external/jenkins/jobs")
public class JenkinsJobController {

    private static final String URI = "http://localhost:8080/";

    @Autowired
    private JenkinsJobService service;

    @GetMapping
    public ResponseEntity<List<Job>> findAll(@RequestParam(defaultValue = "false") final boolean recursive) {
        return ResponseEntity.ok(service.findAllJobs(URI, recursive));
    }

}