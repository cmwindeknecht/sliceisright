package com.SliceIsRight.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor   
@NoArgsConstructor 
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