package com.SliceIsRight.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IngredientOptionDTO {
    public Long id;
    public IngredientDTO ingredient;
    public boolean isRemoved;
    public boolean isLight;
    public boolean isRegular;
    public boolean isDouble;
    public boolean isLeftHalf;
    public boolean isRightHalf;
    public boolean isWholeItem;

    // Use this to check against the menu item to ensure the price is correct
    public boolean isIncluded;
}