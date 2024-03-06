package com.aventstack.kinsjen.api.authtoken;

import org.springframework.data.domain.Example;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuthTokenRepository extends PagingAndSortingRepository<AuthToken, Long> {

    List<AuthToken> findAll(Example example);

    Optional<AuthToken> findByName(final String name);

}
