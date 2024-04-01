package com.aventstack.kinsjen.api.external.jenkins.testreport;

import com.aventstack.kinsjen.api.pipeline.Pipeline;
import com.aventstack.kinsjen.api.pipeline.PipelineNotFoundException;
import com.aventstack.kinsjen.api.pipeline.PipelineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/external/jenkins/testreports")
public class JenkinsTestReportController {

    @Autowired
    private JenkinsTestReportService service;

    @Autowired
    private PipelineService pipelineService;

    @GetMapping
    public ResponseEntity<?> find(@RequestParam final long pipelineId, @RequestParam final int buildId) {
        final Pipeline pipeline = pipelineService.findById(pipelineId).orElseThrow(() ->
                new PipelineNotFoundException("Unable to find a matching pipeline with pipelineId " + pipelineId));
        if (0 >= buildId) {
            return ResponseEntity.badRequest().body("Jenkins buildId must be greater or equal to 1");
        }
        return ResponseEntity.ok(service.findTestReport(pipeline, buildId));
    }

}
