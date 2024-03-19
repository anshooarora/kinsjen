package com.aventstack.kinsjen.api.credential;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
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

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/credentials")
public class CredentialController {

    @Autowired
    private CredentialService service;

    //TODO: encrypt username & apiToken
    @GetMapping
    public ResponseEntity<?> find(@RequestParam(required = false, defaultValue = "0") final long id,
                                 @RequestParam(required = false) final String name,
                                 @RequestParam(required = false, defaultValue = "0") final long jenkinsInstanceId,
                                 final Pageable pageable) {
        if (0 >= id && StringUtils.isBlank(name) && 0 == jenkinsInstanceId) {
            return ResponseEntity.ok(service.findAll(pageable));
        }
        return ResponseEntity.ok(service.search(id, name, jenkinsInstanceId, pageable));
    }

    @GetMapping("/{id}")
    public Optional<Credential> find(@PathVariable final long id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<Credential> create(@Valid @RequestBody final Credential credential) {
        return ResponseEntity.ok(service.create(credential));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable final long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

}
