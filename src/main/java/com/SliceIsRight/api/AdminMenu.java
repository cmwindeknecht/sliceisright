package com.SliceIsRight.api;

import java.util.Optional;

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
import com.SliceIsRight.api.responses.ResponseFactory;

@Path("/admin/menu")
public class AdminMenu 
{
    @POST
    @Path("/item")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addMenuItem(MenuItem menuItem) {
        try {
            menuItem.persist();
            MenuItem.flush();
            return ResponseFactory.GetOkResponse(menuItem, String.format("Successfullly created MenuItem: %s", menuItem.toString()));
        } catch (Exception e) {
            return ResponseFactory.GetBadResponse(e, String.format("Failed to create MenuItem: %s", menuItem.toString()));
        }
    }

    @POST
    @Path("/ingredient")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addMenuItem(Ingredient ingredient) {
        try {
            ingredient.persist();
            Ingredient.flush();
            return ResponseFactory.GetOkResponse(ingredient, String.format("Successfullly created Ingredient: %s", ingredient.toString()));
        } catch (Exception e) {
            return ResponseFactory.GetBadResponse(e, String.format("Failed to create Ingredient: %s", ingredient.toString()));
        }
    }

    public static class MenuItemIngredientRequest {
        public long menuItemId;
        public long ingredientId;
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

            DualCompositeKey dualCompositeKey = DualCompositeKey.builder()
                    .menuItemId(menuItem.id)
                    .ingredientId(ingredient.id)
                    .build();
            MenuItemIngredient menuItemIngredient = new MenuItemIngredient();
            menuItemIngredient.id = dualCompositeKey;
            menuItemIngredient.menuItem = menuItem;
            menuItemIngredient.ingredient = ingredient;
            menuItemIngredient.persist();
            MenuItemIngredient.flush();
            return ResponseFactory.GetOkResponse(menuItemIngredient, String.format("Successfullly created MenuItemIngredient: %s", request.toString()));
        } catch (Exception e) {
            return ResponseFactory.GetBadResponse(e, String.format("Failed to create MenuItemIngredient: %s", request.toString()));
        }
    }
}

