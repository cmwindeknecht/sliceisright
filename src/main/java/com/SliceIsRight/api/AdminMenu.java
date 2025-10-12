package com.SliceIsRight.api;

import java.util.Optional;

import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
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
    @Path("/menuItem")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addMenuItem(MenuItem menuItemToAdd) {
        try {
            Optional.ofNullable(MenuItem.find("name", menuItemToAdd.name)
                .firstResult())
                .ifPresent(existing -> {
                    throw new WebApplicationException(String.format("MenuItem with name %s already exists", menuItemToAdd.name), Response.Status.BAD_REQUEST);
                });

            menuItemToAdd.persist();
            MenuItem.flush();
            
            return ResponseFactory.GetOkResponse(menuItemToAdd, String.format("Successfullly created MenuItem: %s", menuItemToAdd.name));
        } catch (WebApplicationException e) {
            return ResponseFactory.GetWebExceptionResponse(e);
        } catch (Exception e) {
            return ResponseFactory.GetBadRequestResponse(e, String.format("Failed to create MenuItem: %s", menuItemToAdd.name));
        }
    }

    @PUT
    @Path("/menuItem")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateMenuItem(MenuItem menuItemToUpdate) {
        try {    
            MenuItem menuItem = (MenuItem) Optional.ofNullable(MenuItem.findById(menuItemToUpdate.id))
                .orElseThrow(() -> new WebApplicationException(String.format("MenuItem not found to update with id %s", menuItemToUpdate.id), Response.Status.NOT_FOUND));        
            
            menuItem.name = menuItemToUpdate.name;
            menuItem.description = menuItemToUpdate.description;
            menuItem.price = menuItemToUpdate.price;
            menuItem.imageUrl = menuItemToUpdate.imageUrl;
            menuItem.isAvailable = menuItemToUpdate.isAvailable;

            return ResponseFactory.GetOkResponse(menuItem, String.format("Succesfully updated MenuItem with id %s", menuItemToUpdate.id));
        } catch (WebApplicationException e) {
            return ResponseFactory.GetWebExceptionResponse(e);
        } catch (Exception e) {
            return ResponseFactory.GetBadRequestResponse(e, String.format("Failed to update MenuItem with id %s", menuItemToUpdate.id));
        }
    }

    @DELETE
    @Path("/menuItem/{menuItemToDelete}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response deleteMenuItem(@PathParam("menuItemToDelete") long menuItemToDelete) {
        try {
            MenuItem menuItem = (MenuItem) Optional.ofNullable(MenuItem.findById(menuItemToDelete))
                .orElseThrow(() -> new WebApplicationException(String.format("MenuItem not found to delete with id %s", menuItemToDelete), Response.Status.NOT_FOUND));
            
            menuItem.delete();
            MenuItem.flush();

            return ResponseFactory.GetOkResponse(menuItem, String.format("Succesfully deleted MenuItem with id %s", menuItemToDelete));
        } catch (WebApplicationException e) {
            return ResponseFactory.GetWebExceptionResponse(e);
        } catch (Exception e) {
            return ResponseFactory.GetBadRequestResponse(e, String.format("Failed to deleted MenuItem with id %s", menuItemToDelete));
        }
    }

    @POST
    @Path("/ingredient")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addIngredient(Ingredient ingredientToAdd) {
        try {
            Optional.ofNullable(Ingredient.find("name", ingredientToAdd.name)
                .firstResult())
                .ifPresent(existing -> {
                    throw new WebApplicationException(String.format("Ingredient with name %s already exists", ingredientToAdd.name), Response.Status.BAD_REQUEST);
                });

            ingredientToAdd.persist();
            Ingredient.flush();
            return ResponseFactory.GetOkResponse(ingredientToAdd, String.format("Successfullly created Ingredient: %s", ingredientToAdd.toString()));
        } catch (WebApplicationException e) {
            return ResponseFactory.GetWebExceptionResponse(e);
        } catch (Exception e) {
            return ResponseFactory.GetBadRequestResponse(e, String.format("Failed to create Ingredient: %s", ingredientToAdd.toString()));
        }
    }

    @PUT
    @Path("/ingredient")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateIngredient(Ingredient ingredientToUpdate) {
        try {
            Ingredient ingredient = (Ingredient) Optional.ofNullable(Ingredient.findById(ingredientToUpdate.id))
                .orElseThrow(() -> new WebApplicationException(String.format("Ingredient not found to update with name %s", ingredientToUpdate.name), Response.Status.NOT_FOUND));

            ingredient.name = ingredientToUpdate.name;
            ingredient.price = ingredientToUpdate.price;
            ingredient.canBeDoubled = ingredientToUpdate.canBeDoubled;
            ingredient.canBeRemoved = ingredientToUpdate.canBeRemoved;

            return ResponseFactory.GetOkResponse(ingredient, String.format("Succesfully updated Ingredient with id %s", ingredientToUpdate.id));
        } catch (WebApplicationException e) {
            return ResponseFactory.GetWebExceptionResponse(e);
        } catch (Exception e) {
            return ResponseFactory.GetBadRequestResponse(e, String.format("Failed to update Ingredient with id %s", ingredientToUpdate.id));
        }
    }

    @DELETE
    @Path("/ingredient/{ingredientToDelete}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response deleteIngredient(@PathParam("ingredientToDelete") long ingredientToDelete) {
        try {
            Ingredient menuItem = (Ingredient) Optional.ofNullable(Ingredient.findById(ingredientToDelete))
                .orElseThrow(() -> new WebApplicationException(String.format("Ingredient not found to delete with id %s", ingredientToDelete), Response.Status.NOT_FOUND));
            
            menuItem.delete();
            MenuItem.flush();

            return ResponseFactory.GetOkResponse(menuItem, String.format("Succesfully updated Ingredient with id %s", ingredientToDelete));
        } catch (WebApplicationException e) {
            return ResponseFactory.GetWebExceptionResponse(e);
        } catch (Exception e) {
            return ResponseFactory.GetBadRequestResponse(e, String.format("Failed to update Ingredient with id %s", ingredientToDelete));
        }
    }

    public static class MenuItemIngredientRequest {
        public long menuItemId;
        public long ingredientId;
    }

    @POST
    @Path("/menuItemIngredient")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addMenuItemIngredient(MenuItemIngredientRequest request) {
        try {
            MenuItem menuItem = (MenuItem) Optional.ofNullable(MenuItem.findById(request.menuItemId))
                .orElseThrow(() -> new WebApplicationException(String.format("MenuItem with id %s not found to link to Ingredient with id %s", request.menuItemId, request.ingredientId), Response.Status.NOT_FOUND));
            Ingredient ingredient = (Ingredient) Optional.ofNullable(Ingredient.findById(request.ingredientId))
                .orElseThrow(() -> new WebApplicationException(String.format("Ingredient with id %s not found to link to MenuItem with id %s", request.ingredientId, request.menuItemId), Response.Status.NOT_FOUND));

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
        } catch (WebApplicationException e) {
            return ResponseFactory.GetWebExceptionResponse(e);
        } catch (Exception e) {
            return ResponseFactory.GetBadRequestResponse(e, String.format("Failed to create MenuItemIngredient: %s", request.toString()));
        }
    }

    @DELETE
    @Path("/menuItemIngredient/{menuItemToDelete}/{ingredientToDelete}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response deleteMenuItemIngredient(
        @PathParam("ingredientToDelete") long menuItemToDelete,
        @PathParam("ingredientToDelete") long ingredientToDelete
    ) {
        try {
            DualCompositeKey dualCompositeKey = DualCompositeKey.builder()
            .menuItemId(menuItemToDelete)
            .ingredientId(ingredientToDelete)
            .build();

            MenuItemIngredient menuItemIngredient = (MenuItemIngredient) Optional.ofNullable(MenuItemIngredient.findById(dualCompositeKey))
                .orElseThrow(() -> new WebApplicationException(String.format("MenuItemIngredient to delete not found with id %s", dualCompositeKey.toString()), Response.Status.NOT_FOUND));

            menuItemIngredient.delete();
            MenuItem.flush();

            return ResponseFactory.GetOkResponse(menuItemIngredient, String.format("Succesfully deleted MenuItemIngredient with id %s %s", menuItemToDelete, ingredientToDelete));
        } catch (WebApplicationException e) {
            return ResponseFactory.GetWebExceptionResponse(e);
        } catch (Exception e) {
            return ResponseFactory.GetBadRequestResponse(e, String.format("Failed to delete Ingredient with id %s %s", menuItemToDelete, ingredientToDelete));
        }
    }
}

