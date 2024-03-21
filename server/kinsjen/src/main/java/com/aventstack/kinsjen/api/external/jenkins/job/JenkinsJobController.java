package com.aventstack.kinsjen.api.external.jenkins.job;

import com.aventstack.kinsjen.api.pipeline.Pipeline;
import com.aventstack.kinsjen.api.pipeline.PipelineNotFoundException;
import com.aventstack.kinsjen.api.pipeline.PipelineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/external/jenkins/jobs")
public class JenkinsJobController {

    @Autowired
    private JenkinsJobService service;

    @Autowired
    private PipelineService pipelineService;

    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam(defaultValue = "-1") final int jenkinsInstanceId,
            @RequestParam(defaultValue = "-1") final int credentialId,
            @RequestParam(defaultValue = "false") final boolean recursive) {
        if (0 >= jenkinsInstanceId) {
            return ResponseEntity.badRequest().body("Invalid Jenkins instance ID specified: " + jenkinsInstanceId);
        }
        return ResponseEntity.ok(service.findAllJobs(jenkinsInstanceId, credentialId, recursive));
    }

    @GetMapping("/{pipelineId}")
    public ResponseEntity<?> find(@PathVariable final long pipelineId) {
        final Pipeline pipeline = pipelineService.findById(pipelineId).orElseThrow(() ->
                new PipelineNotFoundException("Unable to find a matching pipeline with pipelineId " + pipelineId));
        return ResponseEntity.ok(service.findJob(pipeline));
    }

}
