package com.aventstack.kinsjen.api.jenkinsinstance;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JenkinsInstanceRepository extends PagingAndSortingRepository<JenkinsInstance, Long> {

    Page<JenkinsInstance> findAll(final Example<JenkinsInstance> example, final Pageable pageable);

    Optional<JenkinsInstance> findByName(final String name);

}
