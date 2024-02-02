package com.aventstack.kinsjen.api.org;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class OrgService {

    private static final Logger log = LoggerFactory.getLogger(OrgService.class);

    @Autowired
    private OrgRepository repository;

    public Page<Org> findAll(final Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Optional<Org> findById(final long id) {
        return repository.findById(id);
    }

    public Optional<Org> findByName(final String name) {
        return repository.findByName(name);
    }

    @Transactional
    public Org create(final Org org) {
        log.info("Saving org " + org);
        final Optional<Org> found = repository.findByName(org.getName());
        found.ifPresent(s -> {
            throw new DuplicateOrgException("Org with name " + s.getName() + " already exists");
        });
        return repository.save(org);
    }

    @Transactional
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
    public void delete(final long id) {
        log.info("Deleting org with id " + id);
        repository.deleteById(id);
        log.info("Org " + id + " deleted successfully");
    }

}