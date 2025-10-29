package org.acme.api;

import com.SliceIsRight.database.entities.Ingredient;
import com.SliceIsRight.database.entities.MenuItem;

public class APIFixtures {
    public static MenuItem ValidMenuItem() {
        MenuItem menuItem = new MenuItem();
        menuItem.name = "Burger";
        menuItem.description = "Tasty burger";
        menuItem.imageUrl = "http://example.com/burger.png";
        menuItem.isAvailable = true;

        return menuItem;
    }

        public static Ingredient ValidIngredient() {
        Ingredient ingredient = new Ingredient();
        ingredient.name = "Burger";
        ingredient.canBeDoubled = true;
        ingredient.canBeRemoved = true;

        return ingredient;
    }
}
