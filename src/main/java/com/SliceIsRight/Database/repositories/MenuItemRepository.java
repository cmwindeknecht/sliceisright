package com.SliceIsRight.database.repositories;

import java.util.List;
import java.util.stream.Collectors;

import com.SliceIsRight.Helper;
import com.SliceIsRight.api.model.MenuItemDTO;
import com.SliceIsRight.database.entities.MenuItem;

public class MenuItemRepository {
    public static final MenuItemRepository INSTANCE = new MenuItemRepository();
    private final Helper helper = new Helper();

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
            .map(menuItem -> helper.buildMenuItemDTO(menuItem))
            .collect(Collectors.toList());
    }
}
