package com.aventstack.kinsjen.api.external.jenkins.build;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.MalformedURLException;
import java.net.URL;

@Service
public class JenkinsBuildService {

    @Autowired
    private RestTemplate restTemplate;

    public BuildResponseEntity findAll(final long pipelineId) throws MalformedURLException {
        /*final Pipeline pipeline = pipelineService.findById(pipelineId);
        final URL url = new URL(new URL(pipeline.getUrl()), API_JSON);
        log.debug("Getting job summary for pipeline " + pipeline.getName() + " from url " + url);
        return restTemplate.getForObject(url.toString(), JobSummaryResponseEntity.class);*/
        return null;
    }

}
