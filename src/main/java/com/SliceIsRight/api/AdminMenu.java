package com.SliceIsRight.api;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.microprofile.jwt.JsonWebToken;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import com.SliceIsRight.database.entities.Ingredient;
import com.SliceIsRight.database.entities.IngredientSize;
import com.SliceIsRight.database.entities.MenuItem;
import com.SliceIsRight.database.entities.MenuItemSize;
import com.SliceIsRight.database.repositories.MenuItemRepository;
import com.SliceIsRight.api.responses.ResponseFactory;
import com.SliceIsRight.Constants.Size;
import com.SliceIsRight.Helper;
import com.SliceIsRight.MenuUpdates;
import com.SliceIsRight.api.model.IngredientDTO;
import com.SliceIsRight.api.model.IngredientSizeDTO;
import com.SliceIsRight.api.model.MenuItemDTO;
import com.SliceIsRight.api.model.MenuItemSizeDTO;

@Path("/admin/menu")
public class AdminMenu {
    private final Helper helper = new Helper();

    @Inject
    JsonWebToken jwt; 

    @Inject
    MenuUpdates broadcaster;

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

            broadcaster.broadcast("refreshMenuItems");
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

            broadcaster.broadcast("refreshMenuItems");
            return ResponseFactory.GetCreatedResponse(helper.buildMenuItemDTO(existingMenuItem), "Successfully created MenuItem");
        } catch (Exception exception) {
            System.out.println(String.format("Failed to update MenuItem due to exception %s for request %s", exception.getMessage(), request.toString()));
            return ResponseFactory.GetBadRequestResponse(exception, "Failed to update MenuItem");
        }
    }

    @Path("/menuItem/{menuItemId}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    @RolesAllowed("Admin")
    public Response deleteMenuItem(@PathParam("menuItemId") Long menuItemId) {
        try {
            MenuItem existingMenuItem = MenuItem.<MenuItem>find("id", menuItemId)
                .firstResultOptional()
                .orElseThrow(() -> new WebApplicationException(String.format("Menu Item with id %s not found", menuItemId), Response.Status.NOT_FOUND));
            
            existingMenuItem.delete();

            broadcaster.broadcast("refreshMenuItems");
            return ResponseFactory.GetCreatedResponse(helper.buildMenuItemDTO(existingMenuItem), "Successfully deleted MenuItem");
        } catch (Exception exception) {
            System.out.println(String.format("Failed to delete MenuItem due to exception %s for requested id %s", exception.getMessage(), menuItemId));
            return ResponseFactory.GetBadRequestResponse(exception, "Failed to delete MenuItem");
        }
    }

    private void updateMenuItemFromRequest(MenuItem toUpdate, MenuItemDTO request) throws Exception {
        // update the basic data
        toUpdate.name = request.name;
        toUpdate.description = request.description;
        toUpdate.imageUrl = request.imageUrl;
        toUpdate.category = request.category;
        toUpdate.isAvailable = request.isAvailable;
        toUpdate.isCustomizable = request.isCustomizable;

        // ensure there is at least one size present in the request - every menu item should have a size (even NONE)
        if (request.sizes.size() < 0) {
            throw new Exception("Menu Item update contained zero sizes!");
        }

        // Pull all the associations for the ingredients
        toUpdate.ingredients.clear();
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

        // Ensure that all ingredient associations that were expected from the frontend are present in the backend
        if (ingredients.size() != request.ingredients.size()) {
            throw new Exception(String.format("Failed to find all ingredients in DB to create MenuItem - request size = %s found size = %s", request.ingredients.size(), ingredients.size()));
        }

        // check if the request is removing a size - delete the menu item size association if its not in the request
        Map<Size, MenuItemSize> existingMenuItemSizes = new HashMap<Size, MenuItemSize>();
        Iterator<MenuItemSize> menuItemSizeIterator = toUpdate.sizes.iterator();
        while (menuItemSizeIterator.hasNext()) {
            MenuItemSize menuItemSize = menuItemSizeIterator.next();
            Optional<MenuItemSizeDTO> matchingSizeMaybe = request.sizes.stream()
                .filter(requestSize -> requestSize.size == menuItemSize.size)
                .findFirst();
            if (matchingSizeMaybe.isEmpty()) {
                menuItemSizeIterator.remove();
            } else {
                existingMenuItemSizes.put(menuItemSize.size, menuItemSize);
            }
        }
        
        // update or create new size associations
        Set<MenuItemSize> updatedSizes = request.sizes.stream()
            .map(requestSize -> {
                MenuItemSize menuItemSize = existingMenuItemSizes.getOrDefault(requestSize.size, new MenuItemSize());
                menuItemSize.menuItem = toUpdate;
                menuItemSize.price = requestSize.price;
                menuItemSize.size = requestSize.size;
                menuItemSize.persist();
                return menuItemSize;
            })
            .collect(Collectors.toSet());

        toUpdate.sizes.addAll(updatedSizes);
    }

    @Path("/ingredient")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    @RolesAllowed("Admin")
    public Response createIngredient(IngredientDTO request) {
        try {
            System.out.println("Searching for: name=" + request.name + ", category=" + request.menuItemCategory);

            Ingredient existing = Ingredient.find("name = ?1 and menuItemCategory = ?2", 
                request.name, request.menuItemCategory)
                .firstResult();

            System.out.println("Found: " + existing);
            if (existing != null) {
                System.out.println("Existing category: " + existing.menuItemCategory);
                System.out.println("Request category: " + request.menuItemCategory);
                System.out.println("Are they equal? " + existing.menuItemCategory.equals(request.menuItemCategory));
            }

            if (existing != null) {
                throw new WebApplicationException(
                    String.format("Ingredient with name %s already exists", request.name), 
                    Response.Status.BAD_REQUEST);
            }

            Optional.ofNullable(Ingredient.find("name = ?1 and menuItemCategory = ?2", request.name, request.menuItemCategory)
                .firstResult())
                .ifPresent(existingIngredient -> {
                    throw new WebApplicationException(String.format("Ingredient with name %s already exists", request.name), Response.Status.BAD_REQUEST);
                });
            Ingredient ingredient = new Ingredient();
            updateIngredientFromRequest(ingredient, request);
            Ingredient.persist(ingredient);

            broadcaster.broadcast("refreshIngredients");
            return ResponseFactory.GetCreatedResponse(helper.buildIngredientDTO(ingredient), "Successfully created Ingredient");
        } catch (Exception exception) {
            System.out.println(String.format("Failed to create Ingredient due to exception %s for request %s", exception.getMessage(), request.toString()));
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
                .orElseThrow(() -> new WebApplicationException(String.format("Ingredient with id %s not found", request.id, request.name), Response.Status.NOT_FOUND));

            updateIngredientFromRequest(existingIngredient, request);

            broadcaster.broadcast("refreshIngredients");
            return ResponseFactory.GetCreatedResponse(helper.buildIngredientDTO(existingIngredient), "Successfully updated Ingredient");
        } catch (Exception exception) {
            System.out.println(String.format("Failed to update Ingredient due to exception %s for request %s", exception.getMessage(), request.toString()));
            return ResponseFactory.GetBadRequestResponse(exception, "Failed to update Ingredient");
        }
    }

    @Path("/ingredient/{ingredientId}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    @RolesAllowed("Admin")
    public Response deleteIngredient(@PathParam("ingredientId") Long ingredientId) {
        try {
            Ingredient existingIngredient = Ingredient.<Ingredient>find("id", ingredientId)
                .firstResultOptional()
                .orElseThrow(() -> new WebApplicationException(
                    String.format("Ingredient with id %s not found", ingredientId), 
                    Response.Status.NOT_FOUND
                ));

            MenuItemRepository.INSTANCE.deleteIngredientAssociations(existingIngredient);
            
            existingIngredient.delete();

            broadcaster.broadcast("refreshIngredients");
            return ResponseFactory.GetCreatedResponse(helper.buildIngredientDTO(existingIngredient), "Successfully deleted Ingredient");
        } catch (Exception exception) {
            System.out.println(String.format("Failed to delete Ingredient due to exception %s for requested id %s", exception.getMessage(), ingredientId));
            return ResponseFactory.GetBadRequestResponse(exception, "Failed to delete Ingredient");
        }
    }

    private void updateIngredientFromRequest(Ingredient toUpdate, IngredientDTO request) throws Exception {
        toUpdate.name = request.name;
        toUpdate.imageUrl = request.imageUrl;
        toUpdate.category = request.category;
        toUpdate.menuItemCategory = request.menuItemCategory;
        toUpdate.canBeDoubled = request.canBeDoubled;
        toUpdate.canBeRemoved = request.canBeRemoved;
        toUpdate.canBeHalved = request.canBeHalved;
        toUpdate.canBeLight = request.canBeLight;

        if (request.sizes.size() < 0) {
            throw new Exception("Ingredient update contained zero sizes!");
        }

        // check if the request is removing a size - delete the ingredient size association if its not in the request
        Map<Size, IngredientSize> existingIngredientSizes = new HashMap<Size, IngredientSize>();
        Iterator<IngredientSize> menuItemSizeIterator = toUpdate.sizes.iterator();
        while (menuItemSizeIterator.hasNext()) {
            IngredientSize ingredientSize = menuItemSizeIterator.next();
            Optional<IngredientSizeDTO> matchingSizeMaybe = request.sizes.stream()
                .filter(requestSize -> requestSize.size == ingredientSize.size)
                .findFirst();
            if (matchingSizeMaybe.isEmpty()) {
                menuItemSizeIterator.remove();
            } else {
                existingIngredientSizes.put(ingredientSize.size, ingredientSize);
            }
        }
        
        // update or create new size associations
        Set<IngredientSize> updatedSizes = request.sizes.stream()
            .map(requestSize -> {
                IngredientSize ingredientSize = existingIngredientSizes.getOrDefault(requestSize.size, new IngredientSize());
                ingredientSize.ingredient = toUpdate;
                ingredientSize.price = requestSize.price;
                ingredientSize.size = requestSize.size;
                ingredientSize.persist();
                return ingredientSize;
            })
            .collect(Collectors.toSet());
        
        toUpdate.sizes.addAll(updatedSizes);
    }
}

