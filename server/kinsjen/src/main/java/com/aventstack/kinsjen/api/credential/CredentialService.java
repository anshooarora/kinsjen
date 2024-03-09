package com.aventstack.kinsjen.api.credential;

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

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class CredentialService {

    private static final Logger log = LoggerFactory.getLogger(CredentialService.class);
    private static final ExampleMatcher SEARCH_CONDITIONS = ExampleMatcher
            .matching()
            .withMatcher("name", ExampleMatcher.GenericPropertyMatchers.exact())
            .withIgnorePaths("id");

    @Autowired
    private CredentialRepository repository;

    @Cacheable(value = "credentials")
    public Page<Credential> findAll(final Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Cacheable(value = "credential", key = "#id")
    public Optional<Credential> findById(final long id) {
        return repository.findById(id);
    }

    @Cacheable(value = "credential", key = "#jenkinsInstanceId")
    public Optional<Credential> findByJenkinsInstanceId(final long jenkinsInstanceId) {
        return repository.findByJenkinsInstanceId(jenkinsInstanceId);
    }

    public List<Credential> search(final String name) {
        final Credential credential = new Credential();
        credential.setName(name);
        Example<Credential> example = Example.of(credential, SEARCH_CONDITIONS);
        return repository.findAll(example);
    }

    @Transactional
    @CacheEvict(value = "credentials", allEntries = true)
    @CachePut(value = "credential", key = "#credential.id")
    public Credential create(final Credential credential) {
        log.info("Saving a new instance of credential " + credential);
        return repository.save(credential);
    }

    @Transactional
    @CacheEvict(value = "credential", allEntries = true)
    @CachePut(value = "credential", key = "#credential.id")
    public void update(final Credential credential) {
        log.info("Updating credential " + credential);
        repository.findById(credential.getId()).ifPresentOrElse(
            x -> repository.save(credential),
            () -> { throw new CredentialNotFoundException("Credential with ID " + credential.getId() + " was not found"); }
        );
    }

    @Transactional
    @CacheEvict(value = "credentials", allEntries = true)
    @CachePut(value = "credential", key = "#id")
    public void delete(final long id) {
        log.info("Deleting credential with id " + id);
        repository.deleteById(id);
        log.info("Credential " + id + " was deleted successfully");
    }

}
