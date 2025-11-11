package com.SliceIsRight;

import java.time.Duration;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.microprofile.jwt.Claims;

import com.SliceIsRight.api.model.IngredientDTO;
import com.SliceIsRight.api.model.IngredientSizeDTO;
import com.SliceIsRight.api.model.MenuItemDTO;
import com.SliceIsRight.api.model.MenuItemSizeDTO;
import com.SliceIsRight.database.entities.Ingredient;
import com.SliceIsRight.database.entities.MenuItem;
import com.SliceIsRight.database.entities.UserAccount;

import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class Helper {
    public String getJwtToken(UserAccount user) {
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

    public MenuItemDTO buildMenuItemDTO(MenuItem menuItem) {    
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
                .map(ingredient -> buildIngredientDTO(ingredient))
                .collect(Collectors.toList()))
            .build();
    }

    public IngredientDTO buildIngredientDTO(Ingredient ingredient) {    
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
}
