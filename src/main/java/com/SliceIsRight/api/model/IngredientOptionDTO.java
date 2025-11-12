package com.SliceIsRight.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IngredientOptionDTO {
    private Long id;
    private IngredientDTO ingredient;
    private boolean isRemoved;
    private boolean isLight;
    private boolean isRegular;
    private boolean isDouble;
    private boolean isLeftHalf;
    private boolean isRightHalf;
    private boolean isWholeItem;

    // Use this to check against the menu item to ensure the price is correct
    private boolean isIncluded;
}