package com.SliceIsRight.database.entities;

import com.SliceIsRight.database.DualCompositeKey;

import jakarta.persistence.EmbeddedId;

/**
 * Entity for the join table t_menu_item_ingredient 
 * 
 * Used to define which ingredients are in which menu items
 */
public class MenuItemIngredient {
    @EmbeddedId
    public DualCompositeKey id;
}
