package com.aventstack.kinsjen.api.org;

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
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class OrgService {

    private static final Logger log = LoggerFactory.getLogger(OrgService.class);

    @Autowired
    private OrgRepository repository;

    @Cacheable("orgs")
    public Page<Org> findAll(final Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Cacheable(value = "org", key = "#id")
    public Optional<Org> findById(final long id) {
        return repository.findById(id);
    }

    public Page<Org> search(final long id, final String name, final Pageable pageable) {
        final Org org = new Org();
        org.setId(id);
        org.setName(name);
        Example<Org> example = Example.of(org, ExampleMatcher.matchingAny());
        return repository.findAll(example, pageable);
    }

    public List<Org> search(final long id, final String name) {
        final Org org = new Org();
        org.setId(id);
        org.setName(name);
        Example<Org> example = Example.of(org, ExampleMatcher.matchingAny());
        return repository.findAll(example);
    }

    @Transactional
    @CacheEvict(value = "orgs", allEntries = true)
    @CachePut(value = "org", key = "#org.id")
    public Org create(final Org org) {
        log.info("Saving org " + org);
        final Optional<Org> found = repository.findByName(org.getName());
        found.ifPresent(s -> {
            throw new DuplicateOrgException("Org with name " + s.getName() + " already exists");
        });
        return repository.save(org);
    }

    @Transactional
    @CacheEvict(value = "orgs", allEntries = true)
    @CachePut(value = "org", key = "#org.id")
    public void update(final Org org) {
        log.info("Updating org " + org);
        repository.findById(org.getId()).ifPresentOrElse(
            x -> repository.save(org),
            () -> {
                throw new OrgNotFoundException("Org not found with id " + org.getId());
            }
        );
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "orgs", allEntries = true),
        @CacheEvict(value = "org", key = "#id")
    })
    public void delete(final long id) {
        log.info("Deleting org with id " + id);
        repository.deleteById(id);
        log.info("Org " + id + " deleted successfully");
    }

}
