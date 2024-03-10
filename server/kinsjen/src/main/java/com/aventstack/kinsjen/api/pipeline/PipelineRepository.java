package com.aventstack.kinsjen.api.pipeline;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PipelineRepository extends PagingAndSortingRepository<Pipeline, Long> {

    Page<Pipeline> findAll(final Example<Pipeline> example, final Pageable pageable);

}
