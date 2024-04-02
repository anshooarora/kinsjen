package com.aventstack.kinsjen.api.external.jenkins.consolelogs;

public class InvalidJenkinsBuildException extends RuntimeException {

    public InvalidJenkinsBuildException(final String s) {
        super(s);
    }

}
