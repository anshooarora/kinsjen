package com.aventstack.kinsjen.api.external.jenkins.connection;

import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class ConnectionTestResponse {

    private boolean valid;
    private HttpStatus statusCode;
    private String statusText;
    private String error;

}
