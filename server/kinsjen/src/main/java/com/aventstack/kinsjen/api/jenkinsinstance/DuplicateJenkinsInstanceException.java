package com.aventstack.kinsjen.api.jenkinsinstance;

public class DuplicateJenkinsInstanceException extends RuntimeException {

    public DuplicateJenkinsInstanceException(final String message) {
        super(message);
    }

}
