package com.SliceIsRight.api;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.InternalServerErrorException;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.SecurityContext;

import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/secured")
@RequestScoped
public class JwtTutorial {

    //The JsonWebToken interface is injected, providing access to claims associated with the current authenticated token
    @Inject
    JsonWebToken jwt; 
    //The birthdate claim is injected as a String. This highlights why the @RequestScoped scope is mandatory.
    @Inject
    @Claim(standard = Claims.birthdate)
    String birthdate; 

    @GET
    @Path("permit-all")
    // indicates that the given endpoint is accessible by all callers, whether authenticated or not.
    @PermitAll 
    @Produces(MediaType.TEXT_PLAIN)
    // SecurityContext is injected to inspect the security state of the request
    public String hello(@Context SecurityContext ctx) {
        return getResponseString(ctx); 
    }

    @GET
    //restricts access to users with either the "User" or "Admin" role.
    @Path("roles-allowed") 
    @RolesAllowed({ "User", "Admin" }) 
    @Produces(MediaType.TEXT_PLAIN)
    public String helloRolesAllowed(@Context SecurityContext ctx) {
        return getResponseString(ctx) + ", birthdate: " + jwt.getClaim("birthdate").toString(); 
    }

    @GET
    @Path("roles-allowed-admin")
    @RolesAllowed("Admin")
    @Produces(MediaType.TEXT_PLAIN)
    public String helloRolesAllowedAdmin(@Context SecurityContext ctx) {
        return getResponseString(ctx) + ", birthdate: " + birthdate; 
    }

    private String getResponseString(SecurityContext ctx) {
        String name;
        // Checks if the call is insecure by checking if the request user/caller Principal against null.
        if (ctx.getUserPrincipal() == null) { 
            name = "anonymous";
        // Ensures the names in the Principal and JsonWebToken match because the JsonWebToken represents 
        // the current Principal.
        } else if (!ctx.getUserPrincipal().getName().equals(jwt.getName())) { 
            throw new InternalServerErrorException("Principal and JsonWebToken names do not match");
        } else {
            name = ctx.getUserPrincipal().getName(); 
        }
        // Builds a response containing the caller’s name, the isSecure() and getAuthenticationScheme() 
        // states of the request SecurityContext, and whether a non-null JsonWebToken was injected.
        return String.format("hello %s,"
            + " isHttps: %s,"
            + " authScheme: %s,"
            + " hasJWT: %s",
            name, ctx.isSecure(), ctx.getAuthenticationScheme(), hasJwt()); 
    }

    private boolean hasJwt() {
        return jwt.getClaimNames() != null;
    }
}