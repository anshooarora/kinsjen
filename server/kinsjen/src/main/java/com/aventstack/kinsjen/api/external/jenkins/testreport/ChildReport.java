package com.aventstack.kinsjen.api.external.jenkins.testreport;

import lombok.Data;

@Data
public class ChildReport {

    private Child child;
    private Result result;

}
