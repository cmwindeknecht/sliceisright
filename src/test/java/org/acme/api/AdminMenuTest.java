package org.acme.api;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.SliceIsRight.database.entities.Ingredient;
import com.SliceIsRight.database.entities.MenuItem;
import com.SliceIsRight.database.entities.MenuItemIngredient;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
public class AdminMenuTest {

    private static String MENU_ITEM_URL = "/admin/menu/menuItem";
    private static String DB_NAME = "name";
    private static String BODY_NAME = "entity.name";
    private static String BODY_PRICE = "entity.price";
    private static String BODY_ID = "entity.id";

    @BeforeEach
    @Transactional
    public void cleanup() {
        MenuItem.deleteAll();
        Ingredient.deleteAll();
        MenuItemIngredient.deleteAll();
    }

    @Nested
    @DisplayName("Add MenuItem")
    class AddMenuItem {
        @Test
        public void testAddMenuItem_Success() {
            MenuItem menuItem = APIFixtures.ValidMenuItem();

            given()
                .contentType(ContentType.JSON)
                .body(menuItem)
            .when()
                .post(MENU_ITEM_URL)
            .then()
                .log().body()
                .statusCode(Response.Status.OK.getStatusCode())
                .body(BODY_NAME, equalTo(menuItem.name))
                .body(BODY_PRICE, equalTo(menuItem.price))
                .body(BODY_ID, notNullValue());

            MenuItem persisted = MenuItem.find(DB_NAME, menuItem.name).firstResult();
            assertNotNull(persisted);
            assertEquals(menuItem.name, persisted.name);
            assertEquals(menuItem.price, persisted.price);
        }

        @Test
        public void testAddMenuItem_DuplicateName() {
            MenuItem firstMenuItem = APIFixtures.ValidMenuItem();
            MenuItem duplicateMenuItem = APIFixtures.ValidMenuItem();

            given()
                .contentType(ContentType.JSON)
                .body(firstMenuItem)
            .when()
                .post(MENU_ITEM_URL)
            .then()
                .statusCode(Response.Status.OK.getStatusCode());

            given()
                .contentType(ContentType.JSON)
                .body(duplicateMenuItem)
            .when()
                .post(MENU_ITEM_URL)
            .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body(containsString(String.format("MenuItem with name %s already exists", duplicateMenuItem.name)));

            assertEquals(1, MenuItem.count(DB_NAME, firstMenuItem.name));
        }

        @Test
        public void testAddMenuItem_MissingRequiredFields() {
            MenuItem invalidItem = new MenuItem();

            given()
                .contentType(ContentType.JSON)
                .body(invalidItem)
            .when()
                .post(MENU_ITEM_URL)
            .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode());
        }

        @Test
        public void testAddMenuItem_InvalidJson() {
            given()
                .contentType(ContentType.JSON)
                .body("{invalid json}")
            .when()
                .post(MENU_ITEM_URL)
            .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode());
        }
    }
}