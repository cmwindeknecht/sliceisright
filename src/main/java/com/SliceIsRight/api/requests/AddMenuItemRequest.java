package com.SliceIsRight.api.requests;

import java.util.List;

import com.SliceIsRight.Constants.Category;
import com.SliceIsRight.api.model.IngredientDTO;
import com.SliceIsRight.api.model.MenuItemSizeDTO;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

public class AddMenuItemRequest {
    public String name;
    public String description;
    public String imageUrl;
    public boolean isAvailable;
    public boolean isCustomizable;
    public List<IngredientDTO> ingredients;
    public List<MenuItemSizeDTO> availableSizes;
    @Enumerated(EnumType.STRING)
    public Category category;
}
