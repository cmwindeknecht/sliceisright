package com.SliceIsRight.api;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.microprofile.jwt.JsonWebToken;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import com.SliceIsRight.database.entities.Ingredient;
import com.SliceIsRight.database.entities.IngredientSize;
import com.SliceIsRight.database.entities.MenuItem;
import com.SliceIsRight.database.entities.MenuItemSize;
import com.SliceIsRight.api.responses.ResponseFactory;
import com.SliceIsRight.Helper;
import com.SliceIsRight.api.model.IngredientDTO;
import com.SliceIsRight.api.model.MenuItemDTO;

@Path("/admin/menu")
public class AdminMenu {
    private final Helper helper = new Helper();

    @Inject
    JsonWebToken jwt; 

    @Path("/menuItem")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    @RolesAllowed("Admin")
    public Response createMenuItem(MenuItemDTO request) {
        try {
            Optional.ofNullable(MenuItem.find("name", request.name)
                .firstResult())
                .ifPresent(existing -> {
                    throw new WebApplicationException(String.format("Menu Item with name %s already exists", request.name), Response.Status.BAD_REQUEST);
                });

            MenuItem menuItem = new MenuItem();
            updateMenuItemFromRequest(menuItem, request);
            MenuItem.persist(menuItem);

            return ResponseFactory.GetCreatedResponse(helper.buildMenuItemDTO(menuItem), "Successfully created MenuItem");
        } catch (Exception exception) {
            System.out.println(String.format("Failed to create MenuItem due to exception %s for request %s", exception.getMessage(), request.toString()));
            return ResponseFactory.GetBadRequestResponse(exception, "Failed to create MenuItem");
        }
    }

    @Path("/menuItem")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    @RolesAllowed("Admin")
    public Response updateMenuItem(MenuItemDTO request) {
        try {
            MenuItem existingMenuItem = MenuItem.<MenuItem>find("id", request.id)
                .firstResultOptional()
                .orElseThrow(() -> new WebApplicationException(
                    String.format("Menu Item with id %s name %s not found", request.id, request.name), 
                    Response.Status.NOT_FOUND
                ));
            
            updateMenuItemFromRequest(existingMenuItem, request);

            return ResponseFactory.GetCreatedResponse(helper.buildMenuItemDTO(existingMenuItem), "Successfully created MenuItem");
        } catch (Exception exception) {
            System.out.println(String.format("Failed to update MenuItem due to exception %s for request %s", exception.getMessage(), request.toString()));
            return ResponseFactory.GetBadRequestResponse(exception, "Failed to update MenuItem");
        }
    }

    private void updateMenuItemFromRequest(MenuItem toUpdate, MenuItemDTO request) throws Exception {
        toUpdate.name = request.name;
        toUpdate.description = request.description;
        toUpdate.imageUrl = request.imageUrl;
        toUpdate.category = request.category;
        toUpdate.isAvailable = request.isAvailable;
        toUpdate.isCustomizable = request.isCustomizable;

        Set<Ingredient> ingredients = Ingredient
            .<Ingredient>find(
                "id in ?1",
                request.ingredients.stream()
                    .map(ingredientDto -> ingredientDto.id)
                    .collect(Collectors.toList())
            )
            .list()
            .stream()
            .collect(Collectors.toSet());
        toUpdate.ingredients.addAll(ingredients);

        if (ingredients.size() != request.ingredients.size()) {
            throw new Exception(String.format("Failed to find all ingredients in DB to create MenuItem - request size = %s found size = %s", request.ingredients.size(), ingredients.size()));
        }

        Set<MenuItemSize> sizes = request.sizes.stream()
            .map(menuItemSizeDTO -> {
                MenuItemSize menuItemSize = new MenuItemSize();
                menuItemSize.menuItem = toUpdate;
                menuItemSize.price = menuItemSizeDTO.price;
                menuItemSize.size = menuItemSizeDTO.size;
                MenuItemSize.persist(menuItemSize);
                return menuItemSize;
            })
            .collect(Collectors.toSet()); 
        toUpdate.sizes.addAll(sizes);
    }

    @Path("/ingredient")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    @RolesAllowed("Admin")
    public Response createIngredient(IngredientDTO request) {
        try {
            Optional.ofNullable(Ingredient.find("name", request.name)
                .firstResult())
                .ifPresent(existing -> {
                    throw new WebApplicationException(String.format("Ingredient with name %s already exists", request.name), Response.Status.BAD_REQUEST);
                });
            Ingredient ingredient = new Ingredient();
            updateIngredientFromRequest(ingredient, request);
            Ingredient.persist(ingredient);

            return ResponseFactory.GetCreatedResponse(helper.buildIngredientDTO(ingredient), "Successfully created Ingredient");
        } catch (Exception exception) {
            System.out.println(String.format("Failed to create MenuItem due to exception %s for request %s", exception.getMessage(), request.toString()));
            return ResponseFactory.GetBadRequestResponse(exception, "Failed to create ingredient");
        }
    }

    @Path("/ingredient")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    @RolesAllowed("Admin")
    public Response updateIngredient(IngredientDTO request) {
        try {
            Ingredient existingIngredient = Ingredient.<Ingredient>find("id", request.id)
                .firstResultOptional()
                .orElseThrow(() -> new WebApplicationException(
                    String.format("Ingredient with id %s not found", request.id, request.name), 
                    Response.Status.NOT_FOUND
                ));

            updateIngredientFromRequest(existingIngredient, request);

            return ResponseFactory.GetCreatedResponse(helper.buildIngredientDTO(existingIngredient), "Successfully created Ingredient");
        } catch (Exception exception) {
            System.out.println(String.format("Failed to create MenuItem due to exception %s for request %s", exception.getMessage(), request.toString()));
            return ResponseFactory.GetBadRequestResponse(exception, "Failed to create ingredient");
        }
    }

    private void updateIngredientFromRequest(Ingredient toUpdate, IngredientDTO request) {
        toUpdate.name = request.name;
        toUpdate.category = request.category;
        toUpdate.canBeDoubled = request.canBeDoubled;
        toUpdate.canBeRemoved = request.canBeRemoved;

        Set<IngredientSize> sizes = request.sizes.stream()
            .map(ingredientSizeDTO -> {
                IngredientSize ingredientSize = new IngredientSize();
                ingredientSize.ingredient = toUpdate;
                ingredientSize.price = ingredientSizeDTO.price;
                ingredientSize.size = ingredientSizeDTO.size;
                IngredientSize.persist(ingredientSize);
                return ingredientSize;
            })
            .collect(Collectors.toSet()); 
        toUpdate.sizes.addAll(sizes);
    }
}

