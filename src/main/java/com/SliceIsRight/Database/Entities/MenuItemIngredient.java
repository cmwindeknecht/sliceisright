package com.SliceIsRight.database.entities;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import com.SliceIsRight.database.DualCompositeKey;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

/**
 * Entity for the join table t_menu_item_ingredient 
 * 
 * Used to define which ingredients are in which menu items
 */
@Entity
@Table(name = "menu_item_ingredient")
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemIngredient extends PanacheEntityBase {

    @EmbeddedId
    public DualCompositeKey id = new DualCompositeKey();

    @ManyToOne
    @MapsId("menuItemId")
    @JoinColumn(name = "menu_item_id")
    public MenuItem menuItem;

    @ManyToOne
    @MapsId("ingredientId")
    @JoinColumn(name = "ingredient_id")
    public Ingredient ingredient;
}