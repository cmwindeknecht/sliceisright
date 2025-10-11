package com.SliceIsRight.api;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import com.SliceIsRight.database.entities.Ingredient;
import com.SliceIsRight.database.entities.MenuItemIngredient;
import com.SliceIsRight.database.entities.MenuItem;
import com.SliceIsRight.database.DualCompositeKey;

@Path("/menu")
public class Menu {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getMenuItems() {
        List<MenuItem> menuItems = MenuItem.listAll();
        return menuItems.stream()
                        .map(MenuItem::getName)
                        .collect(Collectors.joining(", "));
    }

    @POST
    @Path("/item")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    public String addMenuItem(MenuItem newItem) {
        newItem.persist();
        
        return "Added: " + newItem.getName();
    }

    @POST
    @Path("/ingredient")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    public String addMenuItem(Ingredient ingredient) {
        ingredient.persist();

        return "Added: " + ingredient.getName();
    }

    @POST
    @Path("/menuitemingredient")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    public String addMenuItemIngredient(MenuItemIngredientRequest request) {
        DualCompositeKey key = new DualCompositeKey(request.field1, request.field2);
        MenuItemIngredient entity = new MenuItemIngredient();
        entity.id = key;
        entity.persist();

        return "Added MenuItemIngredient: " + request.field1 + " / " + request.field2;
    }

    // Optional DTO for easier JSON mapping
    public static class MenuItemIngredientRequest {
        public String field1;
        public String field2;
    }
}

