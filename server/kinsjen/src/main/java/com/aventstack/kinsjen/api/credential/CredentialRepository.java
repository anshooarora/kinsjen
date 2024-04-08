package com.aventstack.kinsjen.api.credential;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CredentialRepository extends PagingAndSortingRepository<Credential, Long> {

    Page<Credential> findAll(final Example<Credential> example, final Pageable pageable);

    Optional<Credential> findByName(final String name);

    List<Credential> removeByJenkinsInstanceId(final long jenkinsInstanceId);

}
