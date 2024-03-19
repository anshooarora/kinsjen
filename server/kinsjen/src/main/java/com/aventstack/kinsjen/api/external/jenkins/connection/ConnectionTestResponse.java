package com.aventstack.kinsjen.api.external.jenkins.connection;

import lombok.Data;

@Data
public class ConnectionTestResponse {

    private boolean valid;
    private String error;

}
