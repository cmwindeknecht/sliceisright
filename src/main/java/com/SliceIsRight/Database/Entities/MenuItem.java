package com.SliceIsRight.database.entities;

import java.util.ArrayList;
import java.util.List;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.json.bind.annotation.JsonbTransient;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/**
 * Entity for the table t_menu_item
 * 
 * Used to define menu items that can be ordered by customers
 **/
@Entity
@AllArgsConstructor   
@NoArgsConstructor 
public class MenuItem extends PanacheEntity {
    @Column(unique = true, nullable = false)
    public String name;
    
    @Column(unique = true, nullable = false)
    public String imageUrl;

    public String description;
    public float price;
    public Boolean isAvailable;

    @OneToMany(mappedBy = "menuItem", fetch = FetchType.LAZY)
    @JsonbTransient  // Ignore this field during deserialization
    public List<MenuItemIngredient> menuItemIngredients = new ArrayList<>();

    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}