package com.aventstack.kinsjen.api.authtoken;

public class AuthTokenNotFoundException extends RuntimeException {

    public AuthTokenNotFoundException(final String message) {
        super(message);
    }

}
