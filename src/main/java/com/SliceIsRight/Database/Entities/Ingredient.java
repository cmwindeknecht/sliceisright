package com.SliceIsRight.database.entities;

import java.util.ArrayList;
import java.util.List;

import com.SliceIsRight.Constants.IngredientCategory;
import com.SliceIsRight.Constants.MenuItemCategory;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity for the table t_menu_item
 * 
 * Used to define ingredients that are used in menu items
 */
@Entity
@AllArgsConstructor   
@NoArgsConstructor 
@Table(
    name = "t_ingredient",
    uniqueConstraints = @UniqueConstraint(columnNames = {"name", "menuitemcategory"})
)
public class Ingredient extends PanacheEntity {
    @Column(nullable = false)
    @Setter @Getter
    public String name;

    public String imageUrl;

    @OneToMany(mappedBy = "ingredient", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<IngredientSize> sizes = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    public IngredientCategory category;

    @Enumerated(EnumType.STRING)
    public MenuItemCategory menuItemCategory;

    public Boolean canBeRemoved;
    public Boolean canBeDoubled;
    public Boolean canBeHalved;
    public Boolean canBeLight;
}