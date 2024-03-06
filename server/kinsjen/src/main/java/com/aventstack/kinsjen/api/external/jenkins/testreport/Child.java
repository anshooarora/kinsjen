package com.aventstack.kinsjen.api.external.jenkins.testreport;

import lombok.Data;

@Data
public class Child {

    private String _class;
    private int number;
    private String result;
    private long timestamp;
    private String url;

}
