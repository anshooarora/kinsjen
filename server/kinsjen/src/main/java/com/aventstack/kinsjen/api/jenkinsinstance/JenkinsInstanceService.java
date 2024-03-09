package com.aventstack.kinsjen.api.jenkinsinstance;

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
public class JenkinsInstanceService {

    private static final Logger log = LoggerFactory.getLogger(JenkinsInstance.class);
    private static final ExampleMatcher SEARCH_CONDITIONS = ExampleMatcher
            .matching()
            .withMatcher("name", ExampleMatcher.GenericPropertyMatchers.exact())
            .withMatcher("type", ExampleMatcher.GenericPropertyMatchers.exact())
            .withMatcher("url", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase())
            .withIgnorePaths("id");

    @Autowired
    private JenkinsInstanceRepository repository;

    @Cacheable(value = "jenkinsInstances")
    public Page<JenkinsInstance> findAll(final Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Cacheable(value = "jenkinsInstance", key = "#id")
    public Optional<JenkinsInstance> findById(final long id) {
        return repository.findById(id);
    }

    public Page<JenkinsInstance> search(final String name, final String type, final String url, final Pageable pageable) {
        final JenkinsInstance server = new JenkinsInstance();
        server.setName(name);
        server.setType(JenkinsInstance.AutomationServerEnum.fromString(type));
        server.setUrl(url);
        Example<JenkinsInstance> example = Example.of(server, SEARCH_CONDITIONS);
        return repository.findAll(example, pageable);
    }

    @Transactional
    @CacheEvict(value = "jenkinsInstances", allEntries = true)
    @CachePut(value = "jenkinsInstance", key = "#jenkinsInstance.id")
    public JenkinsInstance create(final JenkinsInstance jenkinsInstance) {
        log.info("Saving a new instance of Jenkins instance " + jenkinsInstance);
        final Optional<JenkinsInstance> found = repository.findByName(jenkinsInstance.getName());
        found.ifPresent(s -> {
            throw new DuplicateJenkinsInstanceException("Jenkins instance with name " +
                    s.getName() + " for url " + s.getUrl() + " already exists");
        });
        return repository.save(jenkinsInstance);
    }

    @Transactional
    @CacheEvict(value = "jenkinsInstances", allEntries = true)
    @CachePut(value = "jenkinsInstance", key = "#jenkinsInstance.id")
    public void update(final JenkinsInstance jenkinsInstance) {
        log.info("Updating Jenkins instance " + jenkinsInstance);
        repository.findById(jenkinsInstance.getId()).ifPresentOrElse(
            x -> repository.save(jenkinsInstance),
            () -> { throw new JenkinsInstanceNotFoundException("Jenkins instance with ID " + jenkinsInstance.getId() + " was not found"); }
        );
    }

    @Transactional
    @CacheEvict(value = "jenkinsInstances", allEntries = true)
    @CachePut(value = "jenkinsInstance", key = "#id")
    public void delete(final long id) {
        log.info("Deleting Jenkins instance with id " + id);
        repository.deleteById(id);
        log.info("Jenkins instance " + id + " was deleted successfully");
    }

}
