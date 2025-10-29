package com.SliceIsRight.database.repositories;

import java.util.List;
import java.util.stream.Collectors;

import com.SliceIsRight.api.model.IngredientDTO;
import com.SliceIsRight.api.model.IngredientSizeDTO;
import com.SliceIsRight.database.entities.Ingredient;

public class IngredientRepository {
    public static final IngredientRepository INSTANCE = new IngredientRepository();

    public List<IngredientDTO> getAllIngredients() {
        List<Ingredient> ingredients = Ingredient.find(
            "SELECT DISTINCT i FROM Ingredient i " +
            "LEFT JOIN FETCH i.sizes"
        ).list();
    
        List<IngredientDTO> ingredientDTOs = buildIngredientDTOs(ingredients);
        return ingredientDTOs;
    }

    private List<IngredientDTO> buildIngredientDTOs(List<Ingredient> ingredients) {    
        return ingredients.stream()
            .map(ingredient -> IngredientDTO.builder()
                .id(ingredient.id)
                .name(ingredient.name)
                .canBeDoubled(ingredient.canBeDoubled)
                .canBeRemoved(ingredient.canBeRemoved)
                .category(ingredient.category)
                .sizes(
                    ingredient.sizes.stream()
                        .map(size -> new IngredientSizeDTO(size.id, size.size, size.price))
                        .collect(Collectors.toList())
                ).build()
            )
            .collect(Collectors.toList());
    }
}
