package com.SliceIsRight.database.repositories;

import java.util.List;
import java.util.stream.Collectors;

import com.SliceIsRight.api.model.IngredientDTO;
import com.SliceIsRight.api.model.MenuItemDTO;
import com.SliceIsRight.api.model.IngredientDTO.QuantityEnum;
import com.SliceIsRight.database.entities.MenuItem;

public class MenuItemRepository {
    private static final MenuItemRepository INSTANCE = new MenuItemRepository();

    public List<MenuItemDTO> getAllMenuItemsWithIngredients() {
    List<MenuItem> menuItems = MenuItem.find(
        "SELECT DISTINCT m FROM MenuItem m " +
        "LEFT JOIN FETCH m.ingredients mii " +
        "LEFT JOIN FETCH mii.ingredient"
    ).list();
    
    return menuItems.stream()
        .map(item -> MenuItemDTO.builder()
            .id(item.id)
            .name(item.name)
            .price(item.price)
            .ingredients(item.menuItemIngredients.stream()
                .map(menuItemIngredient ->
                    IngredientDTO.builder()
                        .id(menuItemIngredient.ingredient.id)
                        .name(menuItemIngredient.ingredient.name)
                        .quantity(QuantityEnum.REGULAR) // Modift this quantity in the order request
                        .build())
                .collect(Collectors.toList()))
            .build())
        .collect(Collectors.toList());
    }
}
