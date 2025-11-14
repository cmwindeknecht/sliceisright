package com.SliceIsRight.api.errorHandlers;

import io.quarkus.logging.Log;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class IllegalArgumentExceptionHandler implements ExceptionMapper<IllegalArgumentException> {
    @Override
    public Response toResponse(IllegalArgumentException e) {
        Log.warn("Unhandled IllegalArgumentException", e);
        return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
    }
}