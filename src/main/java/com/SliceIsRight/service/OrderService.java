package com.SliceIsRight.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.SliceIsRight.Constants.MenuItemCategory;
import com.SliceIsRight.api.model.AvailableOrderTime;
import com.SliceIsRight.api.model.OrderDTO;
import com.SliceIsRight.api.model.OrderItemDTO;
import com.SliceIsRight.database.entities.OrderItem;
import com.SliceIsRight.database.entities.StoreHours;
import com.SliceIsRight.database.repositories.OrderRepository;

public class OrderService {
    // TODO make this an entity / DB thing that can be updated by the owner
    private float PIZZA_INTERVAL_TIME = 2;
    private float APPETIZER_INTERVAL_TIME = 1;
    private float DESSERT_INTERVAL_TIME = .5f;
    private float SUBS_INTERVAL_TIME = 1f;
    private float MAX_INTERVAL_TIME = 6;

    /**
     * Get Available order times in UTC
     * 
     * @param start
     * @param end
     * @return
     */
    public List<AvailableOrderTime> getAvailableOrderTimes(DayOfWeek day) throws Exception {
        StoreHours storeHours = StoreHours.find("day", day).firstResult();
        if (storeHours == null) {
            throw new Exception(String.format("Storehours not found for date %s", day));
        }

        Map<OffsetDateTime, AvailableOrderTime> availableTimes = new HashMap<>();
        OffsetDateTime current = storeHours.openOrder;

        while (!current.isAfter(storeHours.closeOrder)) {
            availableTimes.put(
                current,
                AvailableOrderTime.builder()
                    .day(day)
                    .time(current)
                    .isAvailable(true)
                    .intervalAmount(0)
                    .maxIntervalAmount(MAX_INTERVAL_TIME)
                    .build()
            );
            current = current.plusMinutes(15);
        }

        List<OrderDTO> todaysOrders = getOrdersByDate(Optional.of(storeHours.openOrder), Optional.of(storeHours.closeOrder));

        for (OrderDTO order : todaysOrders) {
            for (OrderItemDTO orderItem : order.orderItems) {
                
                float orderItemIntervalAmount = getIntervalAmount(orderItem);
                if (orderItemIntervalAmount == 0) {
                    continue;
                }

                AvailableOrderTime currentAvailableOrderTime = availableTimes.get(order.requestedPickupTime);
                float tempIntervalTime = currentAvailableOrderTime.intervalAmount + orderItemIntervalAmount;

                do {
                    if (currentAvailableOrderTime == null) {
                        throw new Exception("Somehow an order exists that is outside of store hours");
                    }

                    if (!currentAvailableOrderTime.isAvailable) {
                        currentAvailableOrderTime = availableTimes.get(currentAvailableOrderTime.time.plusMinutes(15));
                        continue;
                    }

                    if (tempIntervalTime > MAX_INTERVAL_TIME) {
                        currentAvailableOrderTime.intervalAmount = MAX_INTERVAL_TIME;
                    } else {
                        currentAvailableOrderTime.intervalAmount = tempIntervalTime;
                    }
                    currentAvailableOrderTime.isAvailable = currentAvailableOrderTime.intervalAmount < currentAvailableOrderTime.maxIntervalAmount;
                    tempIntervalTime -= MAX_INTERVAL_TIME;

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

    private float getIntervalAmount(OrderItemDTO orderItem) {
        return switch (orderItem.menuItem.category) {
            case PIZZAS -> PIZZA_INTERVAL_TIME * orderItem.quantity;
            case APPETIZERS -> APPETIZER_INTERVAL_TIME * orderItem.quantity;
            case DESSERTS -> DESSERT_INTERVAL_TIME * orderItem.quantity;
            case SUBS -> SUBS_INTERVAL_TIME * orderItem.quantity;
            case BEVERAGES -> 0;
            default -> 0;
        };
    }

    public List<OrderDTO> getOrdersByDate(Optional<OffsetDateTime> startMaybe, Optional<OffsetDateTime> endMaybe) {
        OffsetDateTime start, end;

        if (startMaybe.isEmpty() || endMaybe.isEmpty()) {
            DayOfWeek currentDay = LocalDate.now().getDayOfWeek();
            StoreHours currentDayStoreHours = StoreHours.find("day", currentDay).firstResult();

            if (currentDayStoreHours == null) {
                throw new IllegalStateException("Store hours not found for " + currentDay);
            }

            start = currentDayStoreHours.openOrder;
            end = currentDayStoreHours.closeOrder;
        } else {
            start = startMaybe.get();
            end = endMaybe.get();
        }

        return OrderRepository.INSTANCE.getAllOrders(start, end);
    }
}
