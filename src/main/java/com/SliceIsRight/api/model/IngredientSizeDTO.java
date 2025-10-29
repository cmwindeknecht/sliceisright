package com.SliceIsRight.api.model;

import com.SliceIsRight.Constants.Size;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class IngredientSizeDTO {
    @Enumerated(EnumType.STRING)
    public Size size;

    public Double price;
}