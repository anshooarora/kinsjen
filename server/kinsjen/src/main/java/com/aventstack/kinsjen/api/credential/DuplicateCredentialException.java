package com.aventstack.kinsjen.api.credential;

import javax.validation.constraints.NotBlank;

public class DuplicateCredentialException extends RuntimeException {

    public DuplicateCredentialException(@NotBlank(message = "Missing mandatory field 'name'") String s) {
        super(s);
    }

}
