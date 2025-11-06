package com.SliceIsRight.api;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;

@Provider
public class CorsFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
        String origin = requestContext.getHeaderString("Origin");
        String allowedOrigins = System.getenv("FRONTEND_ORIGINS");

        // Fallback for local dev
        if (allowedOrigins == null) {
            allowedOrigins = "http://localhost:3000";
        }

        if (origin != null) {
            for (String allowed : allowedOrigins.split(",")) {
                if (origin.equals(allowed.trim())) {
                    responseContext.getHeaders().putSingle("Access-Control-Allow-Origin", origin);
                    break;
                }
            }
        }

        responseContext.getHeaders().putSingle("Access-Control-Allow-Headers", "origin, content-type, accept, authorization");
        responseContext.getHeaders().putSingle("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
        responseContext.getHeaders().putSingle("Access-Control-Allow-Credentials", "true");
        responseContext.getHeaders().putSingle("Vary", "Origin");
    }
}
