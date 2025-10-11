package com.SliceIsRight.api;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import com.SliceIsRight.database.entities.Ingredient;
import com.SliceIsRight.database.entities.MenuItem;
import com.SliceIsRight.database.entities.MenuItemIngredient;
import com.SliceIsRight.database.DualCompositeKey;
import com.SliceIsRight.api.responses.OkayResponse;
import com.SliceIsRight.api.responses.ErrorResponse;

@Path("/admin/menu")
public class AdminMenu 
{
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
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addMenuItemIngredient(MenuItemIngredientRequest request) {
        try {
            MenuItem menuItem = (MenuItem) Optional.ofNullable(MenuItem.findById(request.menuItemId))
                .orElseThrow(() -> new WebApplicationException("MenuItem not found", 404));
            Ingredient ingredient = (Ingredient) Optional.ofNullable(Ingredient.findById(request.ingredientId))
                .orElseThrow(() -> new WebApplicationException("Ingredient not found", 404));

            MenuItemIngredient menuItemIngredient = MenuItemIngredient.builder()
                .id(DualCompositeKey.builder()
                    .primaryId(menuItem.id)
                    .secondaryId(ingredient.id)
                    .build())
                .menuItem(menuItem)
                .ingredient(ingredient)
                .build();
            menuItemIngredient.persist();
            
            return Response.status(Response.Status.OK)
                .entity(OkayResponse.builder()
                    .response(String.format("Failed to create Menu Item Ingredient for request: %s", request.toString()))
                    .entity(Optional.of(menuItemIngredient))
                    .build())
                .build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(ErrorResponse.builder()
                    .errorResponse(String.format("Failed to create Menu Item Ingredient for request: %s", request.toString()))  // Add closing paren here
                    .exception(e)
                    .build())
                .build();
        }
    }

    public static class MenuItemIngredientRequest {
        public long menuItemId;
        public long ingredientId;
    }
}

