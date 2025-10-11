package com.SliceIsRight.database.entities;

import java.util.List;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.Builder;

/**
 * Entity for the table t_menu_item
 * 
 * Used to define menu items that can be ordered by customers
 * 
 * @code
 * {
 *     public void example() {
 *         MyEntity entity1 = new MyEntity();
 *         entity1.field = "field-1";
 *         entity1.persist();
 *
 *         List<MyEntity> entities = MyEntity.listAll();
 *     }
 * }
 */
@Entity
@Builder
public class MenuItem extends PanacheEntity {
    public float price;
    public String name;
    public String description;
    public String imageUrl;

    @OneToMany(mappedBy = "menuItem", fetch = FetchType.LAZY)
    public List<MenuItemIngredient> menuItemIngredients;

    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}