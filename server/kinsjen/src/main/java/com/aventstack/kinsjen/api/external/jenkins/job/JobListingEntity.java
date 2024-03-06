package com.aventstack.kinsjen.api.external.jenkins.job;

import lombok.Data;

import java.util.List;

@Data
public class JobListingEntity {

    private List<Job> jobs;

}
