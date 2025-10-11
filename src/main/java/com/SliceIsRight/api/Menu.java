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
import com.SliceIsRight.database.repositories.MenuItemRepository;
import com.SliceIsRight.database.DualCompositeKey;
import com.SliceIsRight.api.responses.OkayResponse;
import com.SliceIsRight.api.model.MenuItemDTO;
import com.SliceIsRight.api.responses.ErrorResponse;

@Path("/menu")
public class Menu {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getMenuItems() {
        List<MenuItemDTO> menuItemDTOs = MenuItemRepository.
    }
}

