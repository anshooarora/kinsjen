package com.aventstack.kinsjen.api.external.jenkins.job;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Job {

    private static final List<String> FOLDER_CLASSES = List.of(
    "com.cloudbees.hudson.plugins.folder.Folder"
    );

    private String _class;

    @NotBlank(message = "Missing mandatory field 'org'")
    private String name;

    private String url;
    private String color;

    @NotBlank(message = "Missing mandatory field 'org'")
    private String org;

    public boolean isFolder() {
        return null != _class && FOLDER_CLASSES.contains(_class);
    }

    public boolean isJob() {
        return !isFolder();
    }

}
