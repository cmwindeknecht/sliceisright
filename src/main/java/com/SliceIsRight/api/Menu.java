package com.SliceIsRight.api;

import java.util.List;
import java.util.Optional;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import com.SliceIsRight.database.entities.Ingredient;
import com.SliceIsRight.database.repositories.MenuItemRepository;
import com.SliceIsRight.api.responses.ResponseFactory;
import com.SliceIsRight.api.model.MenuItemDTO;

@Path("/menu")
public class Menu {

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
            List<Ingredient> ingredients = Ingredient.listAll();
            return ResponseFactory.GetOkResponse(ingredients, "Successfully retrieved ingredients");
        } catch (Exception e) {
            return ResponseFactory.GetBadRequestResponse(e, "Failed to retrieved ingredients");
        }
    }
}

