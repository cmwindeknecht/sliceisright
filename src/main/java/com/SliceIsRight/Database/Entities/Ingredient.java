package com.SliceIsRight.database.entities;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/**
 * Entity for the table t_menu_item
 * 
 * Used to define ingredients that are used in menu items
 */
@Entity
@AllArgsConstructor   
@NoArgsConstructor 
public class Ingredient extends PanacheEntity {
    @Column(unique = true, nullable = false)
    public String name;

    public float price;
    public Boolean canBeRemoved;
    public Boolean canBeDoubled;

    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}