package com.SliceIsRight.api.model;

import lombok.Builder;



@Builder
public class IngredientDTO {
    public Long id;
    public String name;
    public QuantityEnum quantity;

    public enum QuantityEnum {
        NONE,
        REGULAR,
        EXTRA
    }
}