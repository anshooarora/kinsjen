package com.aventstack.kinsjen.api.org;

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

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/orgs")
public class OrgController {

    @Autowired
    private OrgService service;

    @GetMapping
    public ResponseEntity<Page<Org>> findAll(@RequestParam(required = false, defaultValue = "0") final long id,
                                             @RequestParam(required = false) final String name,
                                             final Pageable pageable) {
        if (0 == id && StringUtils.isBlank(name)) {
            return ResponseEntity.ok(service.findAll(pageable));
        }
        return ResponseEntity.ok(service.search(id, name, pageable));
    }

    @GetMapping("/{id}")
    public Optional<Org> find(@PathVariable final long id) {
        return service.findById(id);
    }

    @PostMapping
    public Org create(@Valid @RequestBody final Org org) {
        return service.create(org);
    }

    @PutMapping
    public ResponseEntity<Void> update(@Valid @RequestBody final Org org) {
        service.update(org);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable final long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

}
