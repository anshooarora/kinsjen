package com.aventstack.kinsjen.api.authtoken;

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
public class AuthTokenService {

    private static final Logger log = LoggerFactory.getLogger(AuthTokenService.class);
    private static final ExampleMatcher SEARCH_CONDITIONS = ExampleMatcher
            .matching()
            .withMatcher("name", ExampleMatcher.GenericPropertyMatchers.exact())
            .withIgnorePaths("id");

    @Autowired
    private AuthTokenRepository repository;

    @Cacheable(value = "authTokens")
    public Page<AuthToken> findAll(final Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Cacheable(value = "authToken", key = "#id")
    public Optional<AuthToken> findById(final long id) {
        return repository.findById(id);
    }

    public List<AuthToken> search(final String name) {
        final AuthToken authToken = new AuthToken();
        authToken.setName(name);
        Example<AuthToken> example = Example.of(authToken, SEARCH_CONDITIONS);
        return repository.findAll(example);
    }

    @Transactional
    @CacheEvict(value = "authTokens", allEntries = true)
    @CachePut(value = "authToken", key = "#authToken.id")
    public AuthToken create(final AuthToken authToken) {
        log.info("Saving a new instance of auth-token " + authToken);
        return repository.save(authToken);
    }

    @Transactional
    @CacheEvict(value = "authTokens", allEntries = true)
    @CachePut(value = "authToken", key = "#authToken.id")
    public void update(final AuthToken authToken) {
        log.info("Updating auth-token " + authToken);
        repository.findById(authToken.getId()).ifPresentOrElse(
            x -> repository.save(authToken),
            () -> { throw new AuthTokenNotFoundException("auth-token with ID " + authToken.getId() + " was not found"); }
        );
    }

    @Transactional
    @CacheEvict(value = "authTokens", allEntries = true)
    @CachePut(value = "authToken", key = "#id")
    public void delete(final long id) {
        log.info("Deleting auth-token with id " + id);
        repository.deleteById(id);
        log.info("auth-token " + id + " was deleted successfully");
    }

}
