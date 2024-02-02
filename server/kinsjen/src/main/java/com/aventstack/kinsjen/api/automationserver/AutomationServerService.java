package com.aventstack.kinsjen.api.automationserver;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class AutomationServerService {

    private static final Logger log = LoggerFactory.getLogger(AutomationServer.class);

    @Autowired
    private AutomationServerRepository repository;

    public Page<AutomationServer> findAll(final Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Optional<AutomationServer> findById(final long id) {
        return repository.findById(id);
    }

    public List<AutomationServer> search(final String name, final String type) {
        final AutomationServer server = new AutomationServer();
        server.setName(name);
        server.setType(AutomationServer.AutomationServerEnum.fromString(type));
        /*if (!StringUtils.isBlank(type)) {
            server.setType(AutomationServer.AutomationServerEnum.fromString(type));
        }*/
        return repository.findAll(Example.of(server));
    }

    @Transactional
    public AutomationServer create(final AutomationServer automationServer) {
        log.info("Saving a new instance of automation server " + automationServer);
        final Optional<AutomationServer> found = repository.findByName(automationServer.getName());
        found.ifPresent(s -> {
            throw new DuplicateAutomationServerException("Automation server with name " +
                    s.getName() + " for url " + s.getUrl() + " already exists");
        });
        return repository.save(automationServer);
    }

    @Transactional
    public void update(final AutomationServer automationServer) {
        log.info("Updating automation server " + automationServer);
        repository.findById(automationServer.getId()).ifPresentOrElse(
            x -> repository.save(automationServer),
            () -> { throw new AutomationServerNotFoundException("Automation server with ID " + automationServer.getId() + " was not found"); }
        );
    }

    @Transactional
    public void delete(final long id) {
        log.info("Deleting automation server with id " + id);
        repository.deleteById(id);
        log.info("Automation server " + id + " was deleted successfully");
    }

}
