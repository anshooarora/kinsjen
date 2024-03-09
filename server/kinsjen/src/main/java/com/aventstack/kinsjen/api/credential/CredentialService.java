package com.aventstack.kinsjen.api.credential;

import com.aventstack.kinsjen.api.jenkinsinstance.JenkinsInstanceNotFoundException;
import com.aventstack.kinsjen.api.jenkinsinstance.JenkinsInstanceService;
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
public class CredentialService {

    private static final Logger log = LoggerFactory.getLogger(CredentialService.class);

    @Autowired
    private CredentialRepository repository;

    @Autowired
    private JenkinsInstanceService jenkinsInstanceService;

    @Cacheable(value = "credentials")
    public Page<Credential> findAll(final Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Cacheable(value = "credential", key = "#id")
    public Optional<Credential> findById(final long id) {
        return repository.findById(id);
    }

    public Page<Credential> search(final long id, final String name, final long jenkinsInstanceId, final Pageable pageable) {
        final Credential credential = new Credential();
        credential.setId(id);
        credential.setName(name);
        credential.setJenkinsInstanceId(jenkinsInstanceId);
        Example<Credential> example = Example.of(credential, ExampleMatcher.matchingAny());
        return repository.findAll(example, pageable);
    }

    @Transactional
    @CacheEvict(value = "credentials", allEntries = true)
    @CachePut(value = "credential", key = "#credential.id")
    public Credential create(final Credential credential) {
        log.info("Saving a new instance of credential " + credential);

        jenkinsInstanceService.findById(credential.getJenkinsInstanceId()).ifPresentOrElse(
            x -> log.debug("A new credential will be created for Jenkins instance: " + credential.getJenkinsInstanceId()),
            () -> { throw new JenkinsInstanceNotFoundException("Jenkins instance with ID " + credential.getJenkinsInstanceId() + " was not found"); }
        );

        final Optional<Credential> found = repository.findByName(credential.getName());
        found.ifPresent(s -> {
            throw new DuplicateCredentialException("Credential with name " + s.getName() + " already exists");
        });
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
