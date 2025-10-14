package com.SliceIsRight.database.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    @Setter @Getter
    public String name;
    
    @Column(unique = true, nullable = false)
    public String imageUrl;

    public String description;
    public float price;
    public Boolean isAvailable;

    @OneToMany(mappedBy = "menuItem", fetch = FetchType.LAZY)
    @JsonIgnore  // Ignore this field during deserialization
    public List<MenuItemIngredient> menuItemIngredients = new ArrayList<>();
}