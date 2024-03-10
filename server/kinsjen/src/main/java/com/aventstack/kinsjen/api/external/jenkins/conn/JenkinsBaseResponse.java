package com.aventstack.kinsjen.api.external.jenkins.conn;

import lombok.Data;

import java.util.List;

@Data
public class JenkinsBaseResponse {

    private String _class;
    private List<AssignedLabel> assignedLabels;
    private String mode;
    private String nodeDescription;
    private String nodeName;
    private String numExecutors;
    private boolean useSecurity;

}
