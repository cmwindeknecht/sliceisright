package com.SliceIsRight.api.model;

import java.math.BigDecimal;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDTO {
    public Long id;
    public MenuItemDTO menuItem;
    public MenuItemSizeDTO chosenSize;
    public Integer quantity;
    public String notes;
    public BigDecimal price;
    public Set<IngredientOptionDTO> ingredientOptions;
}
