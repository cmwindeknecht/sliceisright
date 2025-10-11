package com.SliceIsRight.api.model;

import java.util.List;

import lombok.Builder;

@Builder
public class MenuItemDTO {
    public long id;
    public float price;
    public String name;
    public String description;
    public String imageUrl;
    public List<IngredientDTO> ingredients;
}
