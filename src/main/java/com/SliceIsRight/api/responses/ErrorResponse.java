package com.SliceIsRight.api.responses;

import lombok.Builder;

@Builder
public class ErrorResponse {
    public String errorResponse;
    public String exceptionMessage;
    public String exceptionStackTrace;
    public String exceptionType;
}