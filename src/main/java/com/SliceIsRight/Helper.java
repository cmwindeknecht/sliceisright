package com.SliceIsRight;

import java.time.Duration;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.eclipse.microprofile.jwt.Claims;

import com.SliceIsRight.api.models.IngredientDTO;
import com.SliceIsRight.api.models.IngredientOptionDTO;
import com.SliceIsRight.api.models.IngredientSizeDTO;
import com.SliceIsRight.api.models.MenuItemDTO;
import com.SliceIsRight.api.models.MenuItemSizeDTO;
import com.SliceIsRight.api.models.OrderDTO;
import com.SliceIsRight.api.models.OrderItemDTO;
import com.SliceIsRight.api.models.UserDTO;
import com.SliceIsRight.database.entities.Ingredient;
import com.SliceIsRight.database.entities.IngredientOption;
import com.SliceIsRight.database.entities.MenuItem;
import com.SliceIsRight.database.entities.MenuItemSize;
import com.SliceIsRight.database.entities.CustomerOrder;
import com.SliceIsRight.database.entities.OrderItem;
import com.SliceIsRight.database.entities.UserAccount;

import io.smallrye.jwt.build.Jwt;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public final class Helper {

    public static String getJwtToken(UserAccount user) {
        Set<String> privileges = new HashSet<>(Set.of(Constants.USER_PRIVILEGES));
        Duration duration = Duration.ofMinutes(Constants.USER_TOKEN_DURATION);
        if (user.adminPriveleges) {
            privileges.add(Constants.ADMIN_PRIVILEGES);
            duration = Duration.ofMinutes(Constants.ADMIN_TOKEN_DURATION);
        }

        return Jwt.issuer("sliceisright")
              .upn(user.email)
              .expiresIn(duration)
              .groups(privileges)
              .claim(Claims.birthdate.name(), "2001-07-13")
              .sign();
    }

    public static MenuItemDTO buildMenuItemDTO(MenuItem menuItem) {    
        return MenuItemDTO.builder()
            .id(menuItem.id)
            .name(menuItem.name)
            .description(menuItem.description)
            .imageUrl(menuItem.imageUrl)
            .category(menuItem.category)
            .isAvailable(menuItem.isAvailable)
            .isCustomizable(menuItem.isCustomizable)
            .sizes(menuItem.sizes.stream()
                .map(size -> new MenuItemSizeDTO(size.id, size.size, size.price))
                .collect(Collectors.toList()))
            .ingredients(menuItem.ingredients.stream()
                .map(Helper::buildIngredientDTO)
                .collect(Collectors.toList()))
            .build();
    }

    public static IngredientDTO buildIngredientDTO(Ingredient ingredient) {    
        return IngredientDTO.builder()
                .id(ingredient.id)
                .name(ingredient.name)
                .imageUrl(ingredient.imageUrl)
                .canBeDoubled(ingredient.canBeDoubled)
                .canBeRemoved(ingredient.canBeRemoved)
                .canBeHalved(ingredient.canBeHalved)
                .canBeLight(ingredient.canBeLight)
                .category(ingredient.category)
                .menuItemCategory(ingredient.menuItemCategory)
                .sizes(
                    ingredient.sizes.stream()
                        .map(size -> new IngredientSizeDTO(size.id, size.size, size.price))
                        .collect(Collectors.toList())
                )
                .build();
    }

    public static OrderDTO buildOrderDTO(CustomerOrder order) {
        return OrderDTO.builder()
            .id(order.id)
            .orderItems(
                order.orderItems.stream()
                    .map(orderItem -> Helper.buildOrderItemDTO(orderItem))
                    .collect(Collectors.toList()))
            .orderStatus(order.orderStatus)
            .pickedUpDateTime(order.pickedUpDateTime)
            .placedDateTime(order.placedDateTime)
            .requestedPickupTime(order.requestedPickupTime)
            .userEmail(order.user.email)
            .build();
    }

    public static OrderItemDTO buildOrderItemDTO(OrderItem orderItem) {
        return OrderItemDTO.builder()
            .id(orderItem.id)
            .chosenSize(Helper.buildMenuItemSizeDTO(orderItem.chosenSize))
            .ingredientOptions(
                orderItem.ingredientOptions.stream()
                    .map(ingredientOption -> Helper.buildIngredientOptionDTO(ingredientOption))
                    .collect(Collectors.toSet()))
            .menuItem(buildMenuItemDTO(orderItem.menuItem))
            .notes(orderItem.notes)
            .price(orderItem.price)
            .quantity(orderItem.quantity)
            .build();
    }

    public static IngredientOptionDTO buildIngredientOptionDTO(IngredientOption ingredientOption) {
        return IngredientOptionDTO.builder()
            .id(ingredientOption.id)
            .ingredient(Helper.buildIngredientDTO(ingredientOption.ingredient))
            .isDouble(ingredientOption.isDouble)
            .isIncluded(ingredientOption.isIncluded)
            .isLeftHalf(ingredientOption.isLeftHalf)
            .isRightHalf(ingredientOption.isRightHalf)
            .isWholeItem(ingredientOption.isWholeItem)
            .isRemoved(ingredientOption.isRemoved)
            .isLight(ingredientOption.isLight)
            .isDouble(ingredientOption.isDouble)
            .build();
    }

    public static MenuItemSizeDTO buildMenuItemSizeDTO(MenuItemSize menuItemSize) {
        return MenuItemSizeDTO.builder()
            .id(menuItemSize.id)
            .size(menuItemSize.size)
            .price(menuItemSize.price)
            .build();
    }
}
