package com.SliceIsRight.api;

import java.util.Optional;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/hello")
public class Homepage {


    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return String.format(
            "Algorithm: %s\nVerifyKey: %s\nVerifySecret: %s",
            "blah", "blah", "blah"
        );    
    }
}
