package com.aventstack.kinsjen.api.external.jenkins.testreport;

import lombok.Data;

import java.util.List;

@Data
public class Suite {

    private List<Case> cases;
    private double duration;
    private String id;
    private String name;

}
