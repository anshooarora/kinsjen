package com.aventstack.kinsjen.api.jenkinsinstance;

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
@RequestMapping("/jenkins")
public class JenkinsInstanceController {

    @Autowired
    private JenkinsInstanceService service;

    @GetMapping
    public Page<JenkinsInstance> findAll(final Pageable pageable) {
        return service.findAll(pageable);
    }

    @GetMapping("/{id}")
    public Optional<JenkinsInstance> find(@PathVariable final long id) {
        return service.findById(id);
    }

    @GetMapping("/q")
    public ResponseEntity<?> search(@RequestParam(required = false) final String name,
                                    @RequestParam(required = false) final String type,
                                    @RequestParam(required = false) final String url) {
        if (StringUtils.isBlank(name) && StringUtils.isBlank(type) && StringUtils.isBlank(url)) {
            return ResponseEntity.badRequest().body(new BadRequestErrorResponse("Search parameters missing"));
        }
        return ResponseEntity.ok(service.search(name, type, url));
    }

    @PostMapping
    public ResponseEntity<JenkinsInstance> create(@RequestBody final JenkinsInstance server) {
        return ResponseEntity.ok(service.create(server));
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestBody final JenkinsInstance server) {
        service.update(server);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable final long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

}
