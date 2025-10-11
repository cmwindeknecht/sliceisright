package com.SliceIsRight.api.responses;

import lombok.Builder;

@Builder
public class ErrorResponse {
    public String errorResponse;
    public Exception exception;
}