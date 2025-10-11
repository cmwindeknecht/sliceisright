package com.SliceIsRight.database.entities;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

/**
 * Entity for the table t_menu_item
 * 
 * Used to define ingredients that are used in menu items
 */
@Entity
public class Ingredient extends PanacheEntity {
    public float price;
    public String name;

    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}