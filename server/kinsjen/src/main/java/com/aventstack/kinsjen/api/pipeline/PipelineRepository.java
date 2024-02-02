package com.aventstack.kinsjen.api.pipeline;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PipelineRepository extends PagingAndSortingRepository<Pipeline, Long> {

    Optional<Pipeline> findByName(final String name);

    Page<Pipeline> findByOrg(final String org, final Pageable pageable);

    List<Pipeline> findAll(final Example<Pipeline> example);

}
