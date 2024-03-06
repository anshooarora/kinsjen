package com.aventstack.kinsjen.api.jenkinsinstance;

import org.springframework.data.domain.Example;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JenkinsInstanceRepository extends PagingAndSortingRepository<JenkinsInstance, Long> {

    List<JenkinsInstance> findAll(Example example);

    Optional<JenkinsInstance> findByName(final String name);

}
