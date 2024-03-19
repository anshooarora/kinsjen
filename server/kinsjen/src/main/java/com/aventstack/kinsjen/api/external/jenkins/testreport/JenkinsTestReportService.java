package com.aventstack.kinsjen.api.external.jenkins.testreport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.MalformedURLException;

@Service
public class JenkinsTestReportService {

    @Autowired
    private RestTemplate restTemplate;

    public TestReportEntity findById(final long pipelineId, final long id) throws MalformedURLException {
        /*final Pipeline pipeline = pipelineService.findById(pipelineId);
        final URL url = new URL(new URL(pipeline.getUrl()), id + "/testReport/" + API_JSON);
        log.debug("Getting build info for pipeline " + pipeline.getName() + ", job-id " + id + " from url " + url);
        return restTemplate.getForObject(url.toString(), BuildDetailsResponseEntity.class);*/
        return null;
    }

}
