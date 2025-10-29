package com.SliceIsRight.api;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.microprofile.jwt.JsonWebToken;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import com.SliceIsRight.database.entities.Ingredient;
import com.SliceIsRight.database.entities.MenuItem;
import com.SliceIsRight.database.entities.MenuItemSize;
import com.SliceIsRight.api.responses.ResponseFactory;
import com.SliceIsRight.api.model.MenuItemDTO;

@Path("/admin/menu")
public class AdminMenu {

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
            menuItem.name = request.name;
            menuItem.description = request.description;
            menuItem.imageUrl = request.imageUrl;
            menuItem.category = request.category;
            menuItem.isAvailable = request.isAvailable;
            menuItem.isCustomizable = request.isCustomizable;

            Set<Ingredient> ingredients = Ingredient.<Ingredient>find(
                "id in ?1",
                request.ingredients.stream()
                    .map(ingredientDto -> ingredientDto.id)
                    .collect(Collectors.toList())
            )
            .list()
            .stream()
            .collect(Collectors.toSet());

            menuItem.ingredients.addAll(ingredients);

            Set<MenuItemSize> sizes = MenuItemSize.<MenuItemSize>find(
                "id in ?1",
                request.sizes.stream()
                    .map(menuItemSizeDTO -> menuItemSizeDTO.id)
                    .collect(Collectors.toList())
            )
            .list()
            .stream()
            .collect(Collectors.toSet());
            
            menuItem.sizes.addAll(sizes);

            MenuItem.persist(menuItem);

            return ResponseFactory.GetOkResponse(menuItem, "Successfully retrieved menu items");
        } catch (Exception e) {
            return ResponseFactory.GetBadRequestResponse(e, "Failed to retrieved menu items");
        }
    }
}

