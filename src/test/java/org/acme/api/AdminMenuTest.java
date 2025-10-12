package org.acme.api;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
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
    private static String INGREDIENT_URL = "/admin/menu/ingredient";
    private static String MENU_ITEM_INGREDIENT_URL = "/admin/menu/menuItemIngredient";
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

    /*************
     * MENU ITEM *
     *************/
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

    @Transactional
    public MenuItem createMenuItem() {
        MenuItem menuItem = APIFixtures.ValidMenuItem();
        menuItem.persist();
        return menuItem;
    }

    @Test
    public void testUpdateMenuItem_Success() {
        MenuItem menuItem = createMenuItem();

        MenuItem updatedMenuItem = APIFixtures.ValidMenuItem();
        updatedMenuItem.name = "updated";
        updatedMenuItem.price = 1.99f;
        updatedMenuItem.id = menuItem.id;

        given()
            .contentType(ContentType.JSON)
            .body(updatedMenuItem)
        .when()
            .put(MENU_ITEM_URL)
        .then()
            .log().body()
            .statusCode(Response.Status.OK.getStatusCode())
            .body(BODY_NAME, equalTo(updatedMenuItem.name))
            .body(BODY_PRICE, equalTo(updatedMenuItem.price))
            .body(BODY_ID, equalTo(menuItem.id.intValue()));

        MenuItem persisted = MenuItem.find(DB_NAME, updatedMenuItem.name).firstResult();
        assertNotNull(persisted);
        assertEquals(updatedMenuItem.name, persisted.name);
        assertEquals(updatedMenuItem.price, persisted.price);
    }

    @Test
    public void testUpdateMenuItem_NotFound() {
        MenuItem menuItemToUpdate = APIFixtures.ValidMenuItem();
        menuItemToUpdate.id = 1L;

        given()
            .contentType(ContentType.JSON)
            .body(menuItemToUpdate)
        .when()
            .put(MENU_ITEM_URL)
        .then()
            .statusCode(Response.Status.NOT_FOUND.getStatusCode())
            .body(containsString(String.format("MenuItem not found to update with id %s", menuItemToUpdate.id)));
    }

    @Test
    public void testUpdateMenuItem_InvalidJson() {
        given()
            .contentType(ContentType.JSON)
            .body("{invalid json}")
        .when()
            .put(MENU_ITEM_URL)
        .then()
            .statusCode(Response.Status.BAD_REQUEST.getStatusCode());
    }

    @Test
    public void testDeleteMenuItem_Success() {
        MenuItem menuItem = createMenuItem();

        given()
        .when()
            .delete(MENU_ITEM_URL + "/" + menuItem.id)
        .then()
            .log().body()
            .statusCode(Response.Status.OK.getStatusCode())
            .body(BODY_NAME, equalTo(menuItem.name))
            .body(BODY_PRICE, equalTo(menuItem.price))
            .body(BODY_ID, equalTo(menuItem.id.intValue()));

        MenuItem persisted = MenuItem.find(DB_NAME, menuItem.name).firstResult();
        assertNull(persisted);
    }

    @Test
    public void testDeleteMenuItem_NotFound() {
        MenuItem menuItemToUpdate = APIFixtures.ValidMenuItem();
        menuItemToUpdate.id = 1L;

        given()
        .when()
            .delete(MENU_ITEM_URL + "/" + menuItemToUpdate.id)
        .then()
            .statusCode(Response.Status.NOT_FOUND.getStatusCode())
            .body(containsString(String.format("MenuItem not found to delete with id %s", menuItemToUpdate.id)));
    }

    /**************
     * INGREDIENT *
     **************/
    @Test
    public void testAddIngredient_Success() {
        Ingredient ingredient = APIFixtures.ValidIngredient();

        given()
            .contentType(ContentType.JSON)
            .body(ingredient)
        .when()
            .post(INGREDIENT_URL)
        .then()
            .log().body()
            .statusCode(Response.Status.OK.getStatusCode())
            .body(BODY_NAME, equalTo(ingredient.name))
            .body(BODY_PRICE, equalTo(ingredient.price))
            .body(BODY_ID, notNullValue());

        Ingredient persisted = Ingredient.find(DB_NAME, ingredient.name).firstResult();
        assertNotNull(persisted);
        assertEquals(ingredient.name, persisted.name);
        assertEquals(ingredient.price, persisted.price);
    }

    @Test
    public void testAddIngredient_DuplicateName() {
        Ingredient firstIngredient = APIFixtures.ValidIngredient();
        Ingredient duplicateIngredient = APIFixtures.ValidIngredient();

        given()
            .contentType(ContentType.JSON)
            .body(firstIngredient)
        .when()
            .post(INGREDIENT_URL)
        .then()
            .statusCode(Response.Status.OK.getStatusCode());

        given()
            .contentType(ContentType.JSON)
            .body(duplicateIngredient)
        .when()
            .post(INGREDIENT_URL)
        .then()
            .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
            .body(containsString(String.format("Ingredient with name %s already exists", duplicateIngredient.name)));

        assertEquals(1, Ingredient.count(DB_NAME, firstIngredient.name));
    }

    @Test
    public void testAddIngredient_MissingRequiredFields() {
        MenuItem invalidMenuItem = new MenuItem();

        given()
            .contentType(ContentType.JSON)
            .body(invalidMenuItem)
        .when()
            .post(INGREDIENT_URL)
        .then()
            .statusCode(Response.Status.BAD_REQUEST.getStatusCode());
    }

    @Test
    public void testAddIngredient_InvalidJson() {
        given()
            .contentType(ContentType.JSON)
            .body("{invalid json}")
        .when()
            .post(INGREDIENT_URL)
        .then()
            .statusCode(Response.Status.BAD_REQUEST.getStatusCode());
    }

    @Transactional
    public Ingredient createIngredient() {
        Ingredient ingredient = APIFixtures.ValidIngredient();
        ingredient.persist();
        return ingredient;
    }

    @Test
    public void testUpdateIngredient_Success() {
        Ingredient ingredient = createIngredient();

        Ingredient updatedIngredient = APIFixtures.ValidIngredient();
        updatedIngredient.name = "updated";
        updatedIngredient.price = 1.99f;
        updatedIngredient.id = ingredient.id;

        given()
            .contentType(ContentType.JSON)
            .body(updatedIngredient)
        .when()
            .put(INGREDIENT_URL)
        .then()
            .log().body()
            .statusCode(Response.Status.OK.getStatusCode())
            .body(BODY_NAME, equalTo(updatedIngredient.name))
            .body(BODY_PRICE, equalTo(updatedIngredient.price))
            .body(BODY_ID, equalTo(ingredient.id.intValue()));

        Ingredient persisted = Ingredient.find(DB_NAME, updatedIngredient.name).firstResult();
        assertNotNull(persisted);
        assertEquals(updatedIngredient.name, persisted.name);
        assertEquals(updatedIngredient.price, persisted.price);
    }

    @Test
    public void testUpdateIngredient_NotFound() {
        Ingredient ingredientToUpdate = APIFixtures.ValidIngredient();
        ingredientToUpdate.id = 1L;

        given()
            .contentType(ContentType.JSON)
            .body(ingredientToUpdate)
        .when()
            .put(INGREDIENT_URL)
        .then()
            .statusCode(Response.Status.NOT_FOUND.getStatusCode())
            .body(containsString(String.format("Ingredient not found to update with name %s", ingredientToUpdate.name)));
    }

    @Test
    public void testUpdateIngredient_InvalidJson() {
        given()
            .contentType(ContentType.JSON)
            .body("{invalid json}")
        .when()
            .put(INGREDIENT_URL)
        .then()
            .statusCode(Response.Status.BAD_REQUEST.getStatusCode());
    }

    @Test
    public void testDeleteIngredient_Success() {
        Ingredient ingredient = createIngredient();

        given()
        .when()
            .delete(INGREDIENT_URL + "/" + ingredient.id)
        .then()
            .log().body()
            .statusCode(Response.Status.OK.getStatusCode())
            .body(BODY_NAME, equalTo(ingredient.name))
            .body(BODY_PRICE, equalTo(ingredient.price))
            .body(BODY_ID, equalTo(ingredient.id.intValue()));

        Ingredient persisted = Ingredient.find(DB_NAME, ingredient.name).firstResult();
        assertNull(persisted);
    }

    @Test
    public void testDeleteIngredient_NotFound() {
        Ingredient ingredientToDelete = APIFixtures.ValidIngredient();
        ingredientToDelete.id = 1L;

        given()
        .when()
            .delete(INGREDIENT_URL + "/" + ingredientToDelete.id)
        .then()
            .statusCode(Response.Status.NOT_FOUND.getStatusCode())
            .body(containsString(String.format("Ingredient not found to delete with id %s", ingredientToDelete.id)));
    }
}