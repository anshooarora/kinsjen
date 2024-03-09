package com.aventstack.kinsjen.api.pipeline;

import com.aventstack.kinsjen.api.jenkinsinstance.JenkinsInstance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class PipelineService {

    private static final Logger log = LoggerFactory.getLogger(PipelineService.class);
    private static final ExampleMatcher SEARCH_CONDITIONS = ExampleMatcher
            .matching()
            .withMatcher("org", ExampleMatcher.GenericPropertyMatchers.exact().ignoreCase())
            .withMatcher("name", ExampleMatcher.GenericPropertyMatchers.exact().ignoreCase())
            .withMatcher("automationServer", ExampleMatcher.GenericPropertyMatchers.exact().ignoreCase())
            .withMatcher("url", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase())
            .withIgnorePaths("id", "_class");

    @Autowired
    private PipelineRepository repository;

    @Cacheable(value = "pipelines")
    public Page<Pipeline> findAll(final Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Cacheable(value = "pipeline", key = "#id")
    public Optional<Pipeline> findById(final long id) {
        return repository.findById(id);
    }

    public Page<Pipeline> search(final String name, final String org, final String automationServer, final String url, final Pageable pageable) {
        final Pipeline pipeline = new Pipeline();
        pipeline.setOrg(org);
        pipeline.setName(name);
        pipeline.setAutomationServer(JenkinsInstance.AutomationServerEnum.fromString(automationServer));
        pipeline.setUrl(url);
        Example<Pipeline> example = Example.of(pipeline, SEARCH_CONDITIONS);
        return repository.findAll(example, pageable);
    }

    @Transactional
    @CacheEvict(value = "pipelines", allEntries = true)
    @CachePut(value = "pipeline", key = "#pipeline.id")
    public Pipeline create(final Pipeline pipeline) {
        log.info("Saving a new instance of pipeline " + pipeline);
        return repository.save(pipeline);
    }

    @Transactional
    @CacheEvict(value = "pipelines", allEntries = true)
    @CachePut(value = "pipeline", key = "#pipeline.id")
    public void update(final Pipeline pipeline) {
        log.info("Updating pipeline " + pipeline);
        repository.findById(pipeline.getId()).ifPresentOrElse(
            x -> repository.save(pipeline),
            () -> { throw new PipelineNotFoundException("Pipeline with ID " + pipeline.getId() + " was not found"); }
        );
    }

    @Transactional
    @CacheEvict(value = "pipelines", allEntries = true)
    @CachePut(value = "pipeline", key = "#id")
    public void delete(final long id) {
        log.info("Deleting pipeline with id " + id);
        repository.deleteById(id);
        log.info("Pipeline " + id + " was deleted successfully");
    }

}
