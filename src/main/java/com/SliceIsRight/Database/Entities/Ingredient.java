package com.SliceIsRight.database.entities;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import lombok.Builder;

/**
 * Entity for the table t_menu_item
 * 
 * Used to define ingredients that are used in menu items
 */
@Entity
public class Ingredient extends PanacheEntity {
    public float price;
    public String name;
    public boolean canBeRemoved;
    public boolean canBeDoubled;

    public Ingredient() {}

    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}