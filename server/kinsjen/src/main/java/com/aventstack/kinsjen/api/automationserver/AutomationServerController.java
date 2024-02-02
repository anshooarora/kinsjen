package com.aventstack.kinsjen.api.automationserver;

import com.aventstack.kinsjen.domain.BadRequestErrorResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/automation-servers")
public class AutomationServerController {

    @Autowired
    private AutomationServerService service;

    @GetMapping
    public Page<AutomationServer> findAll(final Pageable pageable) {
        return service.findAll(pageable);
    }

    @GetMapping("/{id}")
    public Optional<AutomationServer> find(@PathVariable final long id) {
        return service.findById(id);
    }

    @GetMapping("/q")
    public ResponseEntity<?> search(@RequestParam(required = false) final String name,
                                              @RequestParam(required = false) final String type) {
        if (StringUtils.isBlank(name) && StringUtils.isBlank(type)) {
            return ResponseEntity.badRequest().body(new BadRequestErrorResponse("No search parameters provided"));
        }
        return ResponseEntity.ok(service.search(name, type));
    }

    @PostMapping
    public AutomationServer create(@RequestBody final AutomationServer server) {
        if (server.getType().equals(AutomationServer.AutomationServerEnum.UNSUPPORTED_AUTOMATION_SERVER)) {
            throw new UnsupportedAutomationServerException("Invalid automation server type provided, expecting one of possible types: "
                    + AutomationServer.AutomationServerEnum.valid());
        }
        return service.create(server);
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestBody final AutomationServer server) {
        service.update(server);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable final long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

}
