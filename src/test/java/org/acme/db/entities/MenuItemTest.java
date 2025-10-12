package org.acme.db.entities;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import org.hibernate.Hibernate;
import org.junit.jupiter.api.Test;

import com.SliceIsRight.database.DualCompositeKey;
import com.SliceIsRight.database.entities.Ingredient;
import com.SliceIsRight.database.entities.MenuItem;
import com.SliceIsRight.database.entities.MenuItemIngredient;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
public class MenuItemTest {

    @Test
    @Transactional
    public void testCreateAndFindMenuItem() {
        // Create a new MenuItem
        MenuItem item = new MenuItem();
        item.setName("Test Burger");
        item.imageUrl = "https://example.com/test-burger.jpg";
        item.description = "Delicious test burger";
        item.price = 9.99f;
        item.isAvailable = true;

        // Persist it
        item.persist();

        // Verify it was persisted
        MenuItem found = MenuItem.find("name", "Test Burger").firstResult();
        assertNotNull(found, "MenuItem should be persisted and found in DB");
        assertEquals("Test Burger", found.getName());
        assertEquals(9.99f, found.price);
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
        menuItem.price = 5.99f;
        menuItem.isAvailable = true;
        menuItem.persist();
        
        Ingredient ingredient = new Ingredient();
        ingredient.name = "Cheese";
        ingredient.canBeDoubled = true;
        ingredient.canBeRemoved = true;
        ingredient.price = 2;
        ingredient.persist();
        
        DualCompositeKey key = new DualCompositeKey();
        key.ingredientId = ingredient.id;
        key.menuItemId = menuItem.id;
        
        MenuItemIngredient menuItemIngredient = new MenuItemIngredient();
        menuItemIngredient.id = key;
        menuItemIngredient.ingredient = ingredient;
        menuItemIngredient.menuItem = menuItem;
        menuItemIngredient.persist();
        
        // Force Hibernate to flush and clear the persistence context
        MenuItem.flush();
        MenuItem.getEntityManager().clear();
        
        // Now reload from database
        MenuItem loadedMenuItem = MenuItem.findById(menuItem.id);
        assertNotNull(loadedMenuItem);
        assertNotNull(loadedMenuItem.menuItemIngredients);
        assertEquals(1, loadedMenuItem.menuItemIngredients.size());
        assertEquals("Cheese", loadedMenuItem.menuItemIngredients.get(0).ingredient.name);
    }
}