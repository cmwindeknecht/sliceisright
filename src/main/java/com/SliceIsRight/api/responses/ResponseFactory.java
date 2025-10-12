package com.SliceIsRight.api.responses;

import java.util.Optional;

import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

public class ResponseFactory {

    public static Response GetOkResponse(Object entity, String message) {
        return Response.status(Response.Status.OK)
            .entity(OkayResponse.builder()
                .response(message)
                .entity(Optional.ofNullable(entity))
                .build())
            .build();
    }

    public static Response GetBadRequestResponse(Exception e, String message) {
        return Response.status(Response.Status.BAD_REQUEST)
            .entity(ErrorResponse.builder()
                .errorResponse(message)
                .exceptionMessage(e.getMessage())
                .exceptionStackTrace(e.getStackTrace().toString())
                .exceptionType(e.getClass().getSimpleName())
                .build())
            .build();
    }

    public static Response GetWebExceptionResponse(WebApplicationException e) {
        return Response.status(e.getResponse().getStatus())
            .entity(ErrorResponse.builder()
                .errorResponse(e.getMessage())
                .exceptionMessage(e.getMessage())
                .exceptionStackTrace(e.getStackTrace().toString())
                .exceptionType(e.getClass().getSimpleName())
                .build())
            .build();
    }
}
