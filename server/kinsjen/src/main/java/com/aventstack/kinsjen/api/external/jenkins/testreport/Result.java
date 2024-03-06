package com.aventstack.kinsjen.api.external.jenkins.testreport;

import lombok.Data;

import java.util.List;

@Data
public class Result {

    private String _class;
    private double duration;
    private boolean empty;
    private int failCount;
    private int passCount;
    private int skipCount;
    private List<Suite> suites;

}
