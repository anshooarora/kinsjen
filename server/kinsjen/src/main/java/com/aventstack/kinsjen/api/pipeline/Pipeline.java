package com.aventstack.kinsjen.api.pipeline;

import com.aventstack.kinsjen.api.jenkinsinstance.JenkinsInstance;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "pipeline")
public class Pipeline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "automation_server")
    private JenkinsInstance.AutomationServerEnum automationServer;

    private long jenkinsInstanceId;
    private long credentialId;
    private long orgId;
    private String name;
    private String url;
    private String _class;

}
