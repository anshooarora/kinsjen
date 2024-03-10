package com.aventstack.kinsjen.api.external.jenkins.conn;

import lombok.Data;

@Data
public class ConnectionTestResponse {

    private boolean valid;
    private String error;

}
