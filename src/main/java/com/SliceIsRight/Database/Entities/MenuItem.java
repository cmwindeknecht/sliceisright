package com.SliceIsRight.database.entities;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.SliceIsRight.Constants.Category;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
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
@Table(name = "t_menu_item")
public class MenuItem extends PanacheEntity {
    @Column(unique = true, nullable = false)
    public String name;
   
    public String imageUrl;
    public String description;

    @Enumerated(EnumType.STRING)
    public Category category;

    public Boolean isAvailable;
    public Boolean isCustomizable;
    
    @OneToMany(mappedBy = "menuItem", cascade = CascadeType.ALL, orphanRemoval = true)
    public Set<MenuItemSize> sizes = new HashSet<>();
    
    @ManyToMany
    @JoinTable(
        name = "t_menu_item_ingredient",
        joinColumns = @JoinColumn(name = "menu_item_id"),
        inverseJoinColumns = @JoinColumn(name = "ingredient_id")
    )
    public Set<Ingredient> ingredients = new HashSet<>();
}