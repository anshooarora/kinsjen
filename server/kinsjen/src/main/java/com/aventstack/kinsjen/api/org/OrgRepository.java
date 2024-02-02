package com.aventstack.kinsjen.api.org;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrgRepository extends PagingAndSortingRepository<Org, Long> {

    Optional<Org> findByName(final String name);

}
