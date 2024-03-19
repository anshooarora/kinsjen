package com.aventstack.kinsjen.api.jenkinsinstance;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/jenkins")
public class JenkinsInstanceController {

    @Autowired
    private JenkinsInstanceService service;

    @GetMapping
    public ResponseEntity<?> find(@RequestParam(required = false, defaultValue = "0") final long id,
                                    @RequestParam(required = false) final String name,
                                    @RequestParam(required = false) final String type,
                                    @RequestParam(required = false) final String url,
                                    final Pageable pageable) {
        if (0 >= id && StringUtils.isBlank(name) && StringUtils.isBlank(type) && StringUtils.isBlank(url)) {
            return ResponseEntity.ok(service.findAll(pageable));
        }
        return ResponseEntity.ok(service.search(name, type, url, pageable));
    }

    @GetMapping("/{id}")
    public Optional<JenkinsInstance> find(@PathVariable final long id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<JenkinsInstance> create(@Valid @RequestBody final JenkinsInstance server) {
        return ResponseEntity.ok(service.create(server));
    }

    @PutMapping
    public ResponseEntity<Void> update(@Valid @RequestBody final JenkinsInstance server) {
        service.update(server);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable final long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

}
