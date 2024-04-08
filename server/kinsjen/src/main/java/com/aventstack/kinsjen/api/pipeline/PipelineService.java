package com.aventstack.kinsjen.api.pipeline;

import com.aventstack.kinsjen.api.external.jenkins.JenkinsCommonsService;
import com.aventstack.kinsjen.api.org.Org;
import com.aventstack.kinsjen.api.org.OrgNotFoundException;
import com.aventstack.kinsjen.api.org.OrgService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class PipelineService {

    private static final Logger log = LoggerFactory.getLogger(PipelineService.class);
    private static final ExampleMatcher SEARCH_CONDITIONS = ExampleMatcher
            .matching()
            .withMatcher("jenkinsInstanceId", ExampleMatcher.GenericPropertyMatchers.exact())
            .withMatcher("orgId", ExampleMatcher.GenericPropertyMatchers.exact())
            .withMatcher("org", ExampleMatcher.GenericPropertyMatchers.exact().ignoreCase())
            .withMatcher("name", ExampleMatcher.GenericPropertyMatchers.exact().ignoreCase())
            .withMatcher("automationServer", ExampleMatcher.GenericPropertyMatchers.exact().ignoreCase())
            .withMatcher("url", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase())
            .withIgnorePaths("id", "_class");

    @Autowired
    private PipelineRepository repository;

    @Autowired
    private JenkinsCommonsService jenkinsCommonsService;

    @Autowired
    private OrgService orgService;

    @Cacheable(value = "pipelines")
    public Page<Pipeline> findAll(final Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Cacheable(value = "pipeline", key = "#id")
    public Optional<Pipeline> findById(final long id) {
        return repository.findById(id);
    }

    public Page<Pipeline> search(final Long jenkinsInstanceId, final String name, final Long orgId,
                                 final String orgName, final String url,
                                 final Pageable pageable) {
        final Pipeline pipeline = new Pipeline();
        pipeline.setJenkinsInstanceId(jenkinsInstanceId);
        pipeline.setOrgId(orgId);
        pipeline.setName(name);
        pipeline.setUrl(url);

        if (!StringUtils.isBlank(orgName)) {
            final List<Org> org = orgService.search(0, orgName);
            if (!org.isEmpty()) {
                pipeline.setOrgId(org.get(0).getId());
            }
        }

        Example<Pipeline> example = Example.of(pipeline, SEARCH_CONDITIONS);
        return repository.findAll(example, pageable);
    }

    @Transactional
    @CacheEvict(value = "pipelines", allEntries = true)
    @CachePut(value = "pipeline", key = "#pipeline.id")
    public Pipeline create(final Pipeline pipeline) {
        jenkinsCommonsService.findInstance(pipeline.getJenkinsInstanceId());
        if (0 < pipeline.getCredentialId()) {
            jenkinsCommonsService.findCredential(pipeline.getCredentialId());
        }
        orgService.findById(pipeline.getOrgId())
            .orElseThrow(() -> new OrgNotFoundException("Org not found with id " + pipeline.getOrgId()));
        log.info("Saving a new instance of pipeline " + pipeline);
        final Page<Pipeline> pipelines = findAll(Pageable.ofSize(Integer.MAX_VALUE));
        if (pipelines.stream().anyMatch(x -> x.getUrl().equals(pipeline.getUrl()) && Objects.equals(x.getOrgId(), pipeline.getOrgId()))) {
            throw new DuplicatePipelineException("Exception thrown when creating an already existing pipeline '"
                    + pipeline.getName() + "' with url " + pipeline.getUrl());
        }
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
    @Caching(evict = {
        @CacheEvict(value = "pipelines", allEntries = true),
        @CacheEvict(value = "pipeline", key = "#id")
    })
    public void delete(final long id) {
        log.info("Deleting pipeline with id " + id);
        repository.deleteById(id);
        log.info("Pipeline " + id + " was deleted successfully");
    }

}
