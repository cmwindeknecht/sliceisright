package org.acme.api;

import com.SliceIsRight.database.entities.MenuItem;

public class APIFixtures {
    public static MenuItem ValidMenuItem() {
        MenuItem menuItem = new MenuItem();
        menuItem.name = "Burger";
        menuItem.description = "Tasty burger";
        menuItem.price = 9.99f;
        menuItem.imageUrl = "http://example.com/burger.png";
        menuItem.isAvailable = true;

        return menuItem;
    }
}
