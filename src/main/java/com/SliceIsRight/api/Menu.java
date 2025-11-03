package com.SliceIsRight.api;

import java.util.List;

import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.RestStreamElementType;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.OPTIONS;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import com.SliceIsRight.database.repositories.IngredientRepository;
import com.SliceIsRight.database.repositories.MenuItemRepository;

import io.smallrye.mutiny.Multi;
import io.vertx.core.http.HttpServerResponse;

import com.SliceIsRight.api.responses.ResponseFactory;
import com.SliceIsRight.MenuUpdates;
import com.SliceIsRight.api.model.IngredientDTO;
import com.SliceIsRight.api.model.MenuItemDTO;

@Path("/menu")
public class Menu {

    @Inject
    MenuUpdates broadcaster;
    
    @GET
    @Path("/updates")
    @Produces(MediaType.SERVER_SENT_EVENTS)
    @RestStreamElementType(MediaType.TEXT_PLAIN)
    public Multi<String> streamUpdates(@Context HttpServerResponse response) {
        response.putHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.putHeader("Access-Control-Allow-Credentials", "true");
        System.out.println("Added CORS headers directly for SSE");
        return broadcaster.subscribe();
    }

    @Path("/menuItems")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMenuItems() {
        try {
            List<MenuItemDTO> menuItemDTOs = MenuItemRepository.INSTANCE.getAllMenuItems();
            return ResponseFactory.GetOkResponse(menuItemDTOs, "Successfully retrieved menu items");
        } catch (Exception e) {
            return ResponseFactory.GetBadRequestResponse(e, "Failed to retrieved menu items");
        }
    }

    @Path("/ingredients")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getIngredients() {
        try {
            List<IngredientDTO> ingredients = IngredientRepository.INSTANCE.getAllIngredients();
            return ResponseFactory.GetOkResponse(ingredients, "Successfully retrieved ingredients");
        } catch (Exception e) {
            return ResponseFactory.GetBadRequestResponse(e, "Failed to retrieved ingredients");
        }
    }
}

