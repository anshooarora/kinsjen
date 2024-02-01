package com.aventstack.kinsjen.api.org;

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
@RequestMapping("/orgs")
public class OrgController {

    @Autowired
    private OrgService service;

    @GetMapping
    public Page<Org> findAll(final Pageable pageable) {
        return service.findAll(pageable);
    }

    @GetMapping("/{id}")
    public Org find(@PathVariable final long id) {
        return service.findById(id);
    }

    @GetMapping("/q")
    public  Optional<Org> findByName(@RequestParam final String name) {
        return service.findByName(name);
    }

    @PostMapping
    public Org create(@RequestBody final Org org) {
        return service.create(org);
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestBody final Org org) {
        service.update(org);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable final long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

}
