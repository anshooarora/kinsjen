package com.aventstack.kinsjen.api.automationserver;

import org.springframework.data.domain.Example;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AutomationServerRepository extends PagingAndSortingRepository<AutomationServer, Long> {

    List<AutomationServer> findAll(Example example);

    Optional<AutomationServer> findByName(final String name);

}
