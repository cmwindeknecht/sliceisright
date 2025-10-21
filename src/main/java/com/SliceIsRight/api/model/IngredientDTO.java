package com.SliceIsRight.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor   
@NoArgsConstructor 
public class IngredientDTO {
    @Getter
    public Long id;
    public String name;
    public Boolean canBeRemoved;
    public Boolean canBeDoubled;
}