package com.aventstack.kinsjen.api.jenkinsinstance;

public class JenkinsInstanceNotFoundException extends RuntimeException {

    public JenkinsInstanceNotFoundException(final String message) {
        super(message);
    }

}
