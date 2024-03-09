package com.aventstack.kinsjen.api.credential;

import org.springframework.data.domain.Example;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CredentialRepository extends PagingAndSortingRepository<Credential, Long> {

    List<Credential> findAll(final Example<Credential> example);

    Optional<Credential> findByName(final String name);

    Optional<Credential> findByJenkinsInstanceId(final long jenkinsInstanceId);

}
