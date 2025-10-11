package com.SliceIsRight.api;

import java.util.List;
import java.util.Optional;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import com.SliceIsRight.database.repositories.MenuItemRepository;
import com.SliceIsRight.api.responses.ResponseFactory;
import com.SliceIsRight.api.model.MenuItemDTO;

@Path("/menu")
public class Menu {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMenuItems() {
        try {
            List<MenuItemDTO> menuItemDTOs = MenuItemRepository.INSTANCE.getAllMenuItemsWithIngredients();
            return ResponseFactory.GetOkResponse(menuItemDTOs, "Successfully retrieved menu items");
        } catch (Exception e) {
            return ResponseFactory.GetBadResponse(e, "Failed to retrieved menu items");
        }
    }
}

