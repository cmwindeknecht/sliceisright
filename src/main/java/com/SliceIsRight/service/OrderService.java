package com.SliceIsRight.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.SliceIsRight.Constants.IntervalCategory;
import com.SliceIsRight.api.models.AvailableOrderTime;
import com.SliceIsRight.api.models.IngredientOptionDTO;
import com.SliceIsRight.api.models.OrderDTO;
import com.SliceIsRight.api.models.OrderItemDTO;
import com.SliceIsRight.database.entities.Ingredient;
import com.SliceIsRight.database.entities.IngredientOption;
import com.SliceIsRight.database.entities.MenuItem;
import com.SliceIsRight.database.entities.CustomerOrder;
import com.SliceIsRight.database.entities.OrderInterval;
import com.SliceIsRight.database.entities.OrderItem;
import com.SliceIsRight.database.entities.StoreHours;
import com.SliceIsRight.database.entities.UserAccount;
import com.SliceIsRight.database.repositories.OrderRepository;

import io.quarkus.logging.Log;
import jakarta.transaction.Transactional;

// TODO this service is kind of terrible - measure latency and see how terrible it is
public class OrderService {

    @Transactional
    public CustomerOrder placeOrder(OrderDTO orderDTO) throws Exception {
        try {
            AvailableOrderTime orderTime = getAvailableOrderTime(orderDTO.requestedPickupTime);

            if (!orderTime.isAvailable) {
                throw new Exception("Order requestedPickupTime is unavailable!");
            }

            CustomerOrder order = new CustomerOrder();
            order.user = UserAccount.find("email", orderDTO.userEmail).singleResult();
            order.requestedPickupTime = orderDTO.requestedPickupTime;
            order.orderItems = orderDTO.orderItems.stream()
                .map(orderItem -> createOrderItem(orderItem, order))
                .collect(Collectors.toList());

            order.persist();
            Log.infof("Order successfully placed", Map.of("requestedPickupTime", orderDTO.requestedPickupTime, "userEmail", orderDTO.userEmail));
            return order;
        } catch (Exception exception) {
            Log.errorf("Order failed to be placed", Map.of("requestedPickupTime", orderDTO.requestedPickupTime, "userEmail", orderDTO.userEmail), exception);
            throw exception;
        }
    }

    private OrderItem createOrderItem(OrderItemDTO orderItemDTO, CustomerOrder order) {
        MenuItem menuItem = MenuItem.<MenuItem>findByIdOptional(orderItemDTO.menuItem.id)
            .orElseThrow(() -> new IllegalArgumentException("MenuItem not found: " + orderItemDTO.menuItem.id));
        OrderItem orderItem = new OrderItem();
        orderItem.order = order;
        orderItem.menuItem = menuItem;
        orderItem.chosenSize = orderItem.chosenSize;
        orderItem.ingredientOptions = orderItemDTO.ingredientOptions.stream()
            .map(ingredientOptionDTO -> createIngredientOption(ingredientOptionDTO, orderItem, menuItem))
            .collect(Collectors.toSet());
        orderItem.quantity = orderItemDTO.quantity;
        orderItem.notes = orderItemDTO.notes;
        // TODO verify price data
        orderItem.price = orderItemDTO.price;
        return orderItem;
    }

    private IngredientOption createIngredientOption(IngredientOptionDTO ingredientOptionDTO, OrderItem orderItem, MenuItem menuItem) {
        Ingredient ingredient = Ingredient.<Ingredient>findByIdOptional(ingredientOptionDTO.ingredient.id)
        .orElseThrow(() -> new IllegalArgumentException(                
                String.format("Ingredient not found: id %s name %s", 
                ingredientOptionDTO.ingredient.id, 
                ingredientOptionDTO.ingredient.name)));

        // verify the ingredient is included
        if (ingredientOptionDTO.isIncluded) {
            boolean menuItemHasIngredient = menuItem.ingredients.stream().anyMatch(menuItemIngredient -> ingredient.id == ingredientOptionDTO.ingredient.id);

            if (!menuItemHasIngredient) {
                throw new IllegalArgumentException(                
                    String.format("IngredientOptionDTO claims it is included but its not on the menu item: menuItemId %s ingredientDto ingredientId %s",
                    menuItem.id,
                    ingredientOptionDTO.ingredient.id)
                );
            }
        }    
        
        IngredientOption ingredientOption = new IngredientOption();
        ingredientOption.orderItem = orderItem;
        ingredientOption.ingredient = ingredient;
        ingredientOption.isIncluded = ingredientOptionDTO.isIncluded;
        ingredientOption.isLeftHalf = ingredientOptionDTO.isLeftHalf;
        ingredientOption.isRightHalf = ingredientOptionDTO.isRightHalf;
        ingredientOption.isWholeItem = ingredientOptionDTO.isWholeItem;
        ingredientOption.isLight = ingredientOptionDTO.isLight;
        ingredientOption.isRemoved = ingredientOptionDTO.isRemoved;
        ingredientOption.isRegular = ingredientOptionDTO.isRegular;
        ingredientOption.isDouble = ingredientOptionDTO.isDouble;
        return ingredientOption;
    }

    private AvailableOrderTime getAvailableOrderTime(OffsetDateTime time) throws Exception {
        List<AvailableOrderTime> availableOrderTimes = getAvailableOrderTimes(time.getDayOfWeek());
        return availableOrderTimes.stream()
                .filter(availableOrderTime -> availableOrderTime.time.isEqual(time))
                .findFirst()
                .orElseThrow(() -> new Exception("Order requestedPickupTime is not during store hours!"));
    }

    /**
     * Get Available order times in UTC
     * 
     * @param start
     * @param end
     * @return
     */
    public List<AvailableOrderTime> getAvailableOrderTimes(DayOfWeek day) throws Exception {
        Map<IntervalCategory, OrderInterval> orderIntervalMap = OrderInterval.<OrderInterval>listAll().stream()
            .collect(Collectors.toMap(
                orderInterval -> orderInterval.category,
                orderInterval -> orderInterval
            ));
        StoreHours storeHours = StoreHours.find("day", day).firstResult();
        if (storeHours == null) {
            Log.info("Test log message from backend");
            throw new Exception(String.format("Storehours not found for date %s", day));
        }

        Map<OffsetDateTime, AvailableOrderTime> availableTimes = new HashMap<>();
        OffsetDateTime current = storeHours.openOrder;

        OrderInterval maxInterval = Optional.ofNullable(orderIntervalMap.get(IntervalCategory.MAX_PER_INTERVAL))
            .orElseThrow(() -> new Exception("MAX_PER_INTERVAL not found"));

        while (!current.isAfter(storeHours.closeOrder)) {
            availableTimes.put(
                current,
                AvailableOrderTime.builder()
                    .day(day)
                    .time(current)
                    .isAvailable(true)
                    .intervalAmount(0)
                    .maxIntervalAmount(maxInterval.amount)
                    .build()
            );
            current = current.plusMinutes(15);
        }

        List<OrderDTO> todaysOrders = OrderRepository.INSTANCE.getAllOrders(storeHours.openOrder, storeHours.closeOrder);

        
        for (OrderDTO order : todaysOrders) {
            for (OrderItemDTO orderItem : order.orderItems) {
                
                OrderInterval currentInterval = Optional.ofNullable(orderIntervalMap.get(IntervalCategory.getMenuItemEquivalent(orderItem.menuItem.category)))
                    .orElseThrow(() -> new Exception(String.format("%s is not a valid OrderIntervalCategory", orderItem.menuItem.category)));

                if (currentInterval.amount <= 0) {
                    continue;
                }

                AvailableOrderTime currentAvailableOrderTime = availableTimes.get(order.requestedPickupTime);
                float tempIntervalTime = currentAvailableOrderTime.intervalAmount + currentInterval.amount;

                do {
                    if (currentAvailableOrderTime == null) {
                        throw new Exception("Somehow an order exists that is outside of store hours");
                    }

                    if (!currentAvailableOrderTime.isAvailable) {
                        currentAvailableOrderTime = availableTimes.get(currentAvailableOrderTime.time.plusMinutes(15));
                        continue;
                    }

                    if (tempIntervalTime > maxInterval.amount) {
                        currentAvailableOrderTime.intervalAmount = maxInterval.amount;
                    } else {
                        currentAvailableOrderTime.intervalAmount = tempIntervalTime;
                    }
                    currentAvailableOrderTime.isAvailable = currentAvailableOrderTime.intervalAmount < currentAvailableOrderTime.maxIntervalAmount;
                    tempIntervalTime -= maxInterval.amount;

                    OffsetDateTime nextIntervalTime = currentAvailableOrderTime.time.plusMinutes(15);
                    if (nextIntervalTime.isAfter(storeHours.closeOrder)) {
                        break;
                    }

                    currentAvailableOrderTime = availableTimes.get(nextIntervalTime);
                } while (tempIntervalTime > 0);
            }
        };

        return availableTimes.values().stream()
            .sorted(Comparator.comparing(a -> a.time))
            .collect(Collectors.toList());
    }
}
