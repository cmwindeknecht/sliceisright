package com.SliceIsRight.api.responses;

import jakarta.json.bind.JsonbException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
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

    @Provider
    public static class JsonbExceptionMapper implements ExceptionMapper<JsonbException> {
        @Override
        public Response toResponse(JsonbException exception) {
            return ResponseFactory.GetBadRequestResponse(
                exception, 
                "Invalid JSON format in request body"
            );
        }
    }
}