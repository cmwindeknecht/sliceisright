package com.SliceIsRight.api.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor   
@NoArgsConstructor 
public class ErrorResponse {
    public String errorResponse;
    public String exceptionMessage;
    public String exceptionStackTrace;
    public String exceptionType;
}