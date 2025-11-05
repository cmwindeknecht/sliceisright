package com.SliceIsRight.api.model;

import java.util.List;

import com.SliceIsRight.Constants.IngredientCategory;

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
    public String imageUrl;
    public List<IngredientSizeDTO> sizes;
    public IngredientCategory category;
    public Boolean canBeRemoved;
    public Boolean canBeDoubled;
    public Boolean canBeHalved;
    public Boolean canBeLight;
}