package com.SliceIsRight.database.entities;

import com.SliceIsRight.Constants.Size;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
public class IngredientSize extends PanacheEntity {
    @ManyToOne
    public Ingredient ingredient;
    
    @Enumerated(EnumType.STRING)
    public Size size;
    
    public Double price;
}




