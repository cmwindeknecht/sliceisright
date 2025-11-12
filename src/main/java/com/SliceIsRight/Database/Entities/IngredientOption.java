package com.SliceIsRight.database.entities;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor   
@NoArgsConstructor 
@Table(name = "t_ingredient_option")
public class IngredientOption extends PanacheEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id", nullable = false)
    public OrderItem orderItem;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ingredient_id", nullable = false)
    public Ingredient ingredient;

    public boolean isRemoved;
    public boolean isLight;
    public boolean isRegular;
    public boolean isDouble;
    public boolean isLeftHalf;
    public boolean isRightHalf; 
    public boolean isWholeItem; 
    public boolean isIncluded; // use to check against menu item to ensure accuracy
}
