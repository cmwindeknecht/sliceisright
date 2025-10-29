package com.SliceIsRight.api.responses;

import com.fasterxml.jackson.core.JsonProcessingException;

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
    public static class JacksonExceptionMapper implements ExceptionMapper<JsonProcessingException> {
        @Override
        public Response toResponse(JsonProcessingException exception) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Invalid JSON: " + exception.getMessage())
                    .build();
        }
    }
}