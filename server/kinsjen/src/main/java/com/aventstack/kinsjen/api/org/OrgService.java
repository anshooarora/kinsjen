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

    public Org findById(final long id) {
        return repository.findById(id)
                .orElseThrow(() -> throwEx(id));
    }

    public Optional<Org> findByName(final String name) {
        return repository.findByName(name);
    }

    @Transactional
    public Org create(final Org org) {
        return repository.save(org);
    }

    @Transactional
    public void update(final Org org) {
        repository.findById(org.getId()).ifPresentOrElse(
            x -> repository.save(org),
            () -> throwEx(org.getId())
        );
    }

    @Transactional
    public void delete(final long id) {
        log.info("Deleting org with id " + id);
        repository.deleteById(id);
        log.info("Org " + id + " deleted successfully");
    }

    private OrgNotFoundException throwEx(final Long id) {
        throw new OrgNotFoundException("Org not found with id " + id);
    }

}
