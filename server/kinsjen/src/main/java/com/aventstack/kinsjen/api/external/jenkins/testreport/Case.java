package com.aventstack.kinsjen.api.external.jenkins.testreport;

import lombok.Data;

@Data
public class Case {

    private int age;
    private String className;
    private double duration;
    private String errorDetails;
    private String errorStackTrace;
    private int failedSince;
    private String name;
    private boolean skipped;
    private String skippedMessage;
    private String status;
    private String stderr;
    private String stdout;

}
