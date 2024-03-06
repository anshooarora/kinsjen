package com.aventstack.kinsjen.api.external.jenkins.testreport;

import lombok.Data;

import java.util.List;

@Data
public class TestReportEntity {

    private String _class;
    private int failCount;
    private int skipCount;
    private int totalCount;
    private String urlName;
    private List<ChildReport> childReports;

}
