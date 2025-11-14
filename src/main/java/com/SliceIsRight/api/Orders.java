package com.SliceIsRight.api;

import java.time.OffsetDateTime;
import java.util.List;

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
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import io.quarkus.logging.Log;
import io.smallrye.mutiny.Multi;
import io.vertx.core.http.HttpServerResponse;

import com.SliceIsRight.Helper;
import com.SliceIsRight.api.models.AvailableOrderTime;
import com.SliceIsRight.api.models.OrderDTO;
import com.SliceIsRight.api.responses.ResponseFactory;
import com.SliceIsRight.database.entities.CustomerOrder;
import com.SliceIsRight.database.entities.UserAccount;
import com.SliceIsRight.database.repositories.OrderRepository;
import com.SliceIsRight.service.OrderService;

@Path("/orders")
@ApplicationScoped
public class Orders {

    OrderService orderService = new OrderService();

    @Inject
    JsonWebToken jwt; 

    @Inject
    SseBroadcaster orderTimeBroadcaster; 

    @ConfigProperty(name = "quarkus.http.cors.origins")
    String origins;
    
    /**
     * Used by the Menu (keep next available order time up to date)
     * Used by the Checkout screen (keep list of all available order times up to date)
     * 
     * @param response
     * @return
     */
    // TODO need to send these when an order is placed so the frontend is always aware of available times
    @GET
    @Path("/order_availability_updates")
    @Produces(MediaType.SERVER_SENT_EVENTS)
    @RestStreamElementType(MediaType.TEXT_PLAIN)
    public Multi<String> streamUpdates(@Context HttpServerResponse response) {
        response.putHeader("Access-Control-Allow-Origin", origins);
        response.putHeader("Access-Control-Allow-Credentials", "true");
        return orderTimeBroadcaster.subscribe();
    }

    /**
     * Get order history for a customer
     * 
     * @return
     */
    @Path("/order_availability")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOrderAvailability(@QueryParam("dateTime") OffsetDateTime dateTime) {
        try {
            List<AvailableOrderTime> availableOrderTimes = orderService.getAvailableOrderTimes(dateTime.getDayOfWeek());
            return ResponseFactory.GetOkResponse(availableOrderTimes, "Successfully retrieved customer orders");
        } catch (Exception exception) {
            Log.errorf(String.format("Failed to retrieve available order times"), exception);
            return ResponseFactory.GetBadRequestResponse(exception, "Failed to retrieve available order times");
        }
    }

    /**
     * Get order history for a customer
     * 
     * @return
     */
    @Path("/history")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed("User")
    public Response getOrderHistory(@Context SecurityContext ctx) {
        try {
            String userEmail = ctx.getUserPrincipal().getName();
            UserAccount customer = UserAccount.find("email", userEmail).firstResult();
            List<OrderDTO> customerOrders = OrderRepository.INSTANCE.getOrdersByUser(customer);
            return ResponseFactory.GetOkResponse(customerOrders, "Successfully retrieved customer orders");
        } catch (Exception exception) {
            Log.errorf(String.format("Failed to retrieve customer orders for user %s", ctx.getUserPrincipal().getName()), exception);
            return ResponseFactory.GetBadRequestResponse(exception, "Failed to retrieve customer orders");
        }
    }

    /**
     * Submit a customer order
     * 
     * @param ctx
     * @param request
     * @return
     */
    @Path("/submit")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed("User")
    public Response submitOrder(@Context SecurityContext ctx, OrderDTO request) {
        try {
            if (!ctx.getUserPrincipal().getName().equals(request.userEmail)) {
                throw new Exception("Token user does not match request user email");
            }

            CustomerOrder order = orderService.placeOrder(request);
            return ResponseFactory.GetOkResponse(Helper.buildOrderDTO(order), "Successfully submitted order");
        } catch (Exception exception) {
            Log.errorf(String.format("Failed to submit order for user %s", request.userEmail), exception);
            return ResponseFactory.GetBadRequestResponse(exception, "Failed to submit order");
        }
    }
}

