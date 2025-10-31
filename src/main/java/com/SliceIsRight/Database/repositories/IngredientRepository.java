package com.SliceIsRight.database.repositories;

import java.util.List;
import java.util.stream.Collectors;

import com.SliceIsRight.Helper;
import com.SliceIsRight.api.model.IngredientDTO;
import com.SliceIsRight.database.entities.Ingredient;

public class IngredientRepository {
    public static final IngredientRepository INSTANCE = new IngredientRepository();
    private final Helper helper = new Helper();

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
            .map(ingredient -> helper.buildIngredientDTO(ingredient))
            .collect(Collectors.toList());
    }
}
