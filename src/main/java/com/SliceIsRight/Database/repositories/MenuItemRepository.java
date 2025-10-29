package com.SliceIsRight.database.repositories;

import java.util.List;
import java.util.stream.Collectors;

import com.SliceIsRight.api.model.IngredientDTO;
import com.SliceIsRight.api.model.IngredientSizeDTO;
import com.SliceIsRight.api.model.MenuItemDTO;
import com.SliceIsRight.api.model.MenuItemSizeDTO;
import com.SliceIsRight.database.entities.MenuItem;

public class MenuItemRepository {
    public static final MenuItemRepository INSTANCE = new MenuItemRepository();

    public List<MenuItemDTO> getAllMenuItems() {
        List<MenuItem> menuItems = MenuItem.find(
            "SELECT DISTINCT m FROM MenuItem m " +
            "LEFT JOIN FETCH m.ingredients " +
            "LEFT JOIN FETCH m.sizes"
        ).list();
    
        List<MenuItemDTO> menuItemsDTOs = buildMenuItemDTOs(menuItems);
        return menuItemsDTOs;
    }

    public List<MenuItemDTO> getAvailableMenuItems() {
        List<MenuItem> menuItems = MenuItem.find(
            "SELECT DISTINCT m FROM MenuItem m " +
            "LEFT JOIN FETCH m.ingredients " +
            "LEFT JOIN FETCH m.sizes " +
            "WHERE m.isAvailable = true"
        ).list();

        List<MenuItemDTO> menuItemsDTOs = buildMenuItemDTOs(menuItems);
        return menuItemsDTOs;
    }
    private List<MenuItemDTO> buildMenuItemDTOs(List<MenuItem> menuItems) {    
        return menuItems.stream()
            .map(menuItem -> MenuItemDTO.builder()
                .id(menuItem.id)
                .name(menuItem.name)
                .description(menuItem.description)
                .imageUrl(menuItem.imageUrl)
                .category(menuItem.category)
                .isCustomizable(menuItem.isCustomizable)
                .sizes(menuItem.sizes.stream()
                    .map(size -> new MenuItemSizeDTO(size.size, size.price))
                    .collect(Collectors.toList()))
                .ingredients(menuItem.ingredients.stream()
                    .map(ingredient -> IngredientDTO.builder()
                        .id(ingredient.id)
                        .name(ingredient.name)
                        .category(ingredient.category)
                        .canBeDoubled(ingredient.canBeDoubled)
                        .canBeRemoved(ingredient.canBeRemoved)
                        .sizes(ingredient.sizes.stream()
                            .map(size -> new IngredientSizeDTO(size.size, size.price))
                            .collect(Collectors.toList()))
                        .build())
                    .collect(Collectors.toList()))
                .build())
            .collect(Collectors.toList());
    }
}
