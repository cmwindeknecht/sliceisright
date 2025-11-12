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
    private Long id;
    private MenuItemDTO menuItem;
    private MenuItemSizeDTO chosenSize;
    private Integer quantity;
    private String notes;
    private BigDecimal price;
    private Set<IngredientOptionDTO> ingredientOptions;
}
