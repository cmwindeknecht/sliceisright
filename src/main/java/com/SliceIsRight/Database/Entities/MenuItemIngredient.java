package com.SliceIsRight.database.entities;

import com.SliceIsRight.database.DualCompositeKey;

import jakarta.persistence.EmbeddedId;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

/**
 * Entity for the join table t_menu_item_ingredient 
 * 
 * Used to define which ingredients are in which menu items
 */
public class MenuItemIngredient extends PanacheEntityBase {
    @EmbeddedId
    public DualCompositeKey id;
}
