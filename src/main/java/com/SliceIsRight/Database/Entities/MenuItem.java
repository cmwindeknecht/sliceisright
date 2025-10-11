package com.SliceIsRight.database.entities;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

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
public class MenuItem extends PanacheEntity {
    public float price;
    public String name;
    public String description;
    public String imageUrl;

    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}