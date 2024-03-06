package com.aventstack.kinsjen.api.external.jenkins.build;

import lombok.Data;

import java.util.List;

@Data
public class Build {

    private List<Action> actions;
    private boolean building;
    private String description;
    private String displayName;
    private long duration;
    private long estimatedDuration;
    private String fullDisplayName;
    private String id;
    private boolean inProgress;
    private boolean keepLog;
    private int number;
    private int queueId;
    private String result;
    private long timestamp;
    private String url;
    private String builtOn;
    private List<Culprits> culprits;

}
