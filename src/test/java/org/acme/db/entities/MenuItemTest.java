package org.acme.db.entities;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.transaction.Transactional;

import org.junit.jupiter.api.Test;

import com.SliceIsRight.database.DualCompositeKey;
import com.SliceIsRight.database.entities.Ingredient;
import com.SliceIsRight.database.entities.MenuItem;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
public class MenuItemTest {

    @Test
    @Transactional
    public void testCreateAndFindMenuItem() {
        // Create a new MenuItem
        MenuItem item = new MenuItem();
        item.name ="Test Burger";
        item.imageUrl = "https://example.com/test-burger.jpg";
        item.description = "Delicious test burger";
        item.isAvailable = true;

        // Persist it
        item.persist();

        // Verify it was persisted
        MenuItem found = MenuItem.find("name", "Test Burger").firstResult();
        assertNotNull(found, "MenuItem should be persisted and found in DB");
    }

    @Test
    @Transactional
    public void testListAllMenuItems() {
        List<MenuItem> items = MenuItem.listAll();
        assertNotNull(items, "Should return a list of MenuItems");
    }

    @Test
    @Transactional
    public void testMenuItemWithIngredients() {
        MenuItem menuItem = new MenuItem();
        menuItem.name = "Cheeseburger";
        menuItem.imageUrl = "http://example.com/cheeseburger.png";
        menuItem.description = "Tasty cheeseburger";
        menuItem.isAvailable = true;
        menuItem.persist();
        
        Ingredient ingredient = new Ingredient();
        ingredient.name = "Cheese";
        ingredient.canBeDoubled = true;
        ingredient.canBeRemoved = true;
        ingredient.persist();
        
        DualCompositeKey key = new DualCompositeKey();
        key.ingredientId = ingredient.id;
        key.menuItemId = menuItem.id;
        
        MenuItem.flush();
        MenuItem.getEntityManager().clear();
        
        MenuItem loadedMenuItem = MenuItem.findById(menuItem.id);
        assertNotNull(loadedMenuItem);
    }
}