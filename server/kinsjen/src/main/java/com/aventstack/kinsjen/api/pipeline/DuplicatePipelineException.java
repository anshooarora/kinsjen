package com.aventstack.kinsjen.api.pipeline;

import javax.validation.constraints.NotBlank;

public class DuplicatePipelineException extends RuntimeException {

    public DuplicatePipelineException(final String s) {
        super(s);
    }

}
