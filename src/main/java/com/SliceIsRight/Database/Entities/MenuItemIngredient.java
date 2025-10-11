package com.SliceIsRight.database.entities;

import com.SliceIsRight.database.DualCompositeKey;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

/**
 * Entity for the join table t_menu_item_ingredient 
 * 
 * Used to define which ingredients are in which menu items
 */
@Entity
@AllArgsConstructor   
@NoArgsConstructor 
public class MenuItemIngredient extends PanacheEntityBase {
    @EmbeddedId
    public DualCompositeKey id;

    @ManyToOne
    @MapsId("menuItemId")  // Maps to the menuItemId in the composite key
    @JoinColumn(name = "menu_item_id")
    public MenuItem menuItem;
    
    @ManyToOne
    @MapsId("ingredientId")  // Maps to the ingredientId in the composite key
    @JoinColumn(name = "ingredient_id")
    public Ingredient ingredient;
}
