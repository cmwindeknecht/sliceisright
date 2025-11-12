package com.SliceIsRight.api;

import java.util.Map;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jboss.resteasy.reactive.RestStreamElementType;

import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import io.smallrye.mutiny.Multi;
import io.vertx.core.http.HttpServerResponse;

import com.SliceIsRight.api.responses.ResponseFactory;

@Path("/order")
@ApplicationScoped
// TODO need an OrderService - probably should have an Admin Service and whatever else too...
public class Order {

    @Inject
    JsonWebToken jwt; 

    @Inject
    SseBroadcaster adminOrderBroadcaster; 

    @Inject
    SseBroadcaster orderTimeBroadcaster; 

    @ConfigProperty(name = "quarkus.http.cors.origins")
    String origins;
    
    /**
     * Used for the Admin Orders dashboard to prevent the need for refresh
     * 
     * @param response
     * @return
     */
    @GET
    @Path("/admin/orders/updates")
    @Produces(MediaType.SERVER_SENT_EVENTS)
    @RestStreamElementType(MediaType.TEXT_PLAIN)
    @RolesAllowed("Admin")
    public Multi<String> streamAdminOrderUpdates(@Context HttpServerResponse response) {
        response.putHeader("Access-Control-Allow-Origin", origins);
        response.putHeader("Access-Control-Allow-Credentials", "true");
        return adminOrderBroadcaster.subscribe();
    }

    /**
     * Used by the Menu (keep next available order time up to date)
     * Used by the Checkout screen (keep list of all available order times up to date)
     * 
     * @param response
     * @return
     */
    @GET
    @Path("/order_availability/updates")
    @Produces(MediaType.SERVER_SENT_EVENTS)
    @RestStreamElementType(MediaType.TEXT_PLAIN)
    @RolesAllowed("Admin")
    public Multi<String> streamUpdates(@Context HttpServerResponse response) {
        response.putHeader("Access-Control-Allow-Origin", origins);
        response.putHeader("Access-Control-Allow-Credentials", "true");
        return adminOrderBroadcaster.subscribe();
    }

    /**
     * Used to get a list of all customer orders for the requested time frame
     *   -- should have a from/to calendar in frontend to select dates so the history can be viewed
     * 
     * @return
     */
    @Path("/admin/orders")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed("User")
    public Response getCustomerOrders() {
        try {
            return ResponseFactory.GetOkResponse(Map.of(), "Successfully retrieved customer orders");
        } catch (Exception e) {
            return ResponseFactory.GetBadRequestResponse(e, "Failed to retrieve customer orders");
        }
    }

    /**
     * 
     * @return
     */
    @Path("/customer/orders")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed("User")
    public Response getPastOrders() {
        try {
            return ResponseFactory.GetOkResponse(Map.of(), "Successfully retrieved customer orders");
        } catch (Exception e) {
            return ResponseFactory.GetBadRequestResponse(e, "Failed to retrieve customer orders");
        }
    }

    @Path("/customer/orders")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed("User")
    public Response submitOrder() {
        // TODO need to make validation rules on if an order time is still available
        try {
            return ResponseFactory.GetOkResponse(Map.of(), "Successfully submitted order");
        } catch (Exception e) {
            return ResponseFactory.GetBadRequestResponse(e, "Failed to submit order");
        }
    }
}

