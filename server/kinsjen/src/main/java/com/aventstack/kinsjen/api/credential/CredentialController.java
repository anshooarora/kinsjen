package com.aventstack.kinsjen.api.credential;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/credentials")
public class CredentialController {

    @Autowired
    private CredentialService service;

    @GetMapping
    public Page<Credential> findAll(final Pageable pageable) {
        return service.findAll(pageable);
    }

    @GetMapping("/{id}")
    public Optional<Credential> find(@PathVariable final long id) {
        return service.findById(id);
    }

    @GetMapping("/q")
    public Optional<Credential> search(@RequestParam(required = false) final String name,
            @RequestParam(required = false) final Long jenkinsInstanceId) {
        //TODO: allow searching by name
        //TODO: encrypt username & apiToken
        return service.findByJenkinsInstanceId(jenkinsInstanceId);
    }

    @PostMapping
    public ResponseEntity<Credential> create(@RequestBody final Credential credential) {
        return ResponseEntity.ok(service.create(credential));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable final long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

}
