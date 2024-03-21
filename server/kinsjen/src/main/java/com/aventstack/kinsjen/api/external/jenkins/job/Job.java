package com.aventstack.kinsjen.api.external.jenkins.job;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Job {

    private static final List<String> FOLDER_CLASSES = List.of(
    "com.cloudbees.hudson.plugins.folder.Folder"
    );

    private String _class;
    private List<Action> actions;
    private String description;
    private String displayName;
    private String displayNameOrNull;
    private String fullDisplayName;
    private String fullName;
    private String name;
    private String url;
    private boolean buildable;
    private List<Build> builds;
    private String color;
    private Build firstBuild;
    private boolean inQueue;
    private boolean keepDependencies;
    private Build lastBuild;
    private Build lastCompletedBuild;
    private Build lastFailedBuild;
    private Build lastStableBuild;
    private Build lastSuccessfulBuild;
    private Build lastUnstableBuild;
    private Build lastUnsuccessfulBuild;
    private int nextBuildNumber;
    private boolean concurrentBuild;

    public boolean isFolder() {
        return null != _class && FOLDER_CLASSES.contains(_class);
    }

    public boolean isJob() {
        return !isFolder();
    }

}
