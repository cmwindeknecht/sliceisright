package com.SliceIsRight.api.model;

import java.util.List;

import com.SliceIsRight.Constants.Category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor   
@NoArgsConstructor 
public class MenuItemDTO {
    public long id;
    public String name;
    public String description;
    public String imageUrl;
    
    public boolean isAvailable;
    public boolean isCustomizable;
    public List<IngredientDTO> ingredients;
    public List<MenuItemSizeDTO> sizes;
    
    public Category category;
}

    
