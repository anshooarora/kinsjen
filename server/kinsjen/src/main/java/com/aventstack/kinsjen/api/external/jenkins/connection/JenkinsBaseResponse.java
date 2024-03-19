package com.aventstack.kinsjen.api.external.jenkins.connection;

import lombok.Data;

import java.util.List;

@Data
public class JenkinsBaseResponse {

    private String _class;
    private String mode;
    private String nodeDescription;
    private String nodeName;
    private String numExecutors;
    private boolean useSecurity;

}
