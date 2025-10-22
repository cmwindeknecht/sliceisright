package com.SliceIsRight.database.entities;

import java.util.ArrayList;
import java.util.List;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
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
@Table(name = "t_ingredient")
public class Ingredient extends PanacheEntity {
    @Column(unique = true, nullable = false)
    @Setter @Getter
    public String name;

    @OneToMany(mappedBy = "ingredient", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<IngredientSize> sizes = new ArrayList<>();

    public Boolean canBeRemoved;
    public Boolean canBeDoubled;
}