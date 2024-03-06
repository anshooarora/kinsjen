package com.aventstack.kinsjen.api.external.jenkins.build;

import lombok.Data;

@Data
public class Action {

    private String _class;
    private int failCount;
    private int skipCount;
    private int totalCount;
    private String urlName;

}
