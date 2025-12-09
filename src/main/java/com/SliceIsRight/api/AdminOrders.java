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
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import io.quarkus.logging.Log;
import io.smallrye.mutiny.Multi;
import io.vertx.core.http.HttpServerResponse;

import com.SliceIsRight.Helper;
import com.SliceIsRight.api.models.OrderDTO;
import com.SliceIsRight.api.responses.ResponseFactory;
import com.SliceIsRight.database.entities.CustomerOrder;
import com.SliceIsRight.database.repositories.OrderRepository;
import com.SliceIsRight.service.OrderService;

@Path("/admin/orders")
@ApplicationScoped
public class AdminOrders {

    OrderService orderService = new OrderService();

    @Inject
    JsonWebToken jwt; 

    @Inject
    SseBroadcaster adminOrderBroadcaster; 

    @ConfigProperty(name = "quarkus.http.cors.origins")
    String origins;
    
    /**
     * Used for the Admin Orders dashboard to prevent the need for refresh
     * 
     * @param response
     * @return
     */
    @GET
    @Path("/order_updates")
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
     * 
     * @return
     */
    @Path("/orders")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed("Admin")
    public Response getAllCustomerOrders(@QueryParam("startTime") OffsetDateTime startTime, @QueryParam("endTime") OffsetDateTime endTime) {
        try {
            List<OrderDTO> customerOrders = OrderRepository.INSTANCE.getAllOrders(startTime, endTime);
            return ResponseFactory.GetOkResponse(customerOrders, "Successfully retrieved customer orders for admin");
        } catch (Exception exception) {
            Log.errorf(String.format("Failed to retrieve customer orders"), exception);
            return ResponseFactory.GetBadRequestResponse(exception, "Failed to retrieve customer orders for admin");
        }
    }

    @Path("/submit")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed("Admin")
    public Response submitOrder(OrderDTO request) {
        try {
            CustomerOrder order = orderService.placeOrder(request);
            return ResponseFactory.GetOkResponse(Helper.buildOrderDTO(order), "Successfully submitted admin order");
        } catch (Exception exception) {
            Log.errorf(String.format("Failed to submit order for admin %s", request.userEmail), exception);
            return ResponseFactory.GetBadRequestResponse(exception, "Failed to submit admin order");
        }
    }
}

