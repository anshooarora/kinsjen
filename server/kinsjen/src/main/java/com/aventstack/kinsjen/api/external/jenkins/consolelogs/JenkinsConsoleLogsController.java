package com.aventstack.kinsjen.api.external.jenkins.consolelogs;

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
@RequestMapping("/external/jenkins/consolelogs")
public class JenkinsConsoleLogsController {

    @Autowired
    private JenkinsConsoleLogsService service;

    @Autowired
    private PipelineService pipelineService;

    @GetMapping(produces = "text/plain")
    public ResponseEntity<?> find(@RequestParam final long pipelineId,
                                  @RequestParam final int buildNumber) {
        final Pipeline pipeline = pipelineService.findById(pipelineId).orElseThrow(() ->
                new PipelineNotFoundException("Unable to find a matching pipeline with pipelineId " + pipelineId));
        if (0 >= buildNumber) {
            throw new InvalidJenkinsBuildException("Invalid build number specified: '" + buildNumber + "'");
        }
        return ResponseEntity.ok(service.findConsoleText(pipeline, buildNumber));
    }

}
