package com.aventstack.kinsjen.api.pipeline;

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
@RequestMapping("/pipelines")
public class PipelineController {

    @Autowired
    private PipelineService service;

    @GetMapping
    public ResponseEntity<Page<Pipeline>> findAll(@RequestParam(required = false) final String name,
                                                  @RequestParam(required = false, defaultValue = "-1L") final long org,
                                                  @RequestParam(required = false) final String automationServer,
                                                  @RequestParam(required = false) final String url,
                                                  final Pageable pageable) {
        if (StringUtils.isAllBlank(name, automationServer, url) && 0L > org) {
            return ResponseEntity.ok(service.findAll(pageable));
        }
        return ResponseEntity.ok(service.search(name, org, automationServer, url, pageable));
    }

    @GetMapping("/{id}")
    public Optional<Pipeline> find(@PathVariable final long id) {
        return service.findById(id);
    }

    @PostMapping
    public Pipeline create(@Valid @RequestBody final Pipeline pipeline) {
        return service.create(pipeline);
    }

    @PutMapping
    public ResponseEntity<Void> update(@Valid @RequestBody final Pipeline pipeline) {
        service.update(pipeline);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable final long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

}
