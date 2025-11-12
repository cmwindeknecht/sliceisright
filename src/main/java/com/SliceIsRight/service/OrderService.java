package com.SliceIsRight.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.SliceIsRight.Constants.MenuItemCategory;
import com.SliceIsRight.api.model.AvailableOrderTime;
import com.SliceIsRight.api.model.OrderDTO;
import com.SliceIsRight.api.model.OrderItemDTO;
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
    public List<AvailableOrderTime> getAvailableOrderTimes(OffsetDateTime start, OffsetDateTime end) throws Exception {
        Map<OffsetDateTime, AvailableOrderTime> availableTimes = new HashMap<>();
        OffsetDateTime current = start;
        DayOfWeek day = current.getDayOfWeek();

        while (!current.isAfter(end)) {
            availableTimes.put(
                current,
                AvailableOrderTime.builder()
                    .day(day)
                    .time(current)
                    .isAvailable(true)
                    .currentOrderAmount(0)
                    .build()
            );
            current = current.plusMinutes(15);
        }

        List<OrderDTO> todaysOrders = getOrdersByDate(Optional.of(start), Optional.of(end));

        // TODO I added time to AvailableTimes (needed by frontend anyways)
        //   update all of this, no need for reservations map now
        Map<OffsetDateTime, Float> orderReservations = new HashMap<>();

        for (OrderDTO order : todaysOrders) {
            for (OrderItemDTO orderItem : order.orderItems) {
                
                float orderItemIntervalAmount = 0;
                switch (orderItem.menuItem.category) {
                    case MenuItemCategory.PIZZAS:
                        orderItemIntervalAmount = PIZZA_INTERVAL_TIME * orderItem.quantity;
                        break;
                    case MenuItemCategory.APPETIZERS:
                        orderItemIntervalAmount = APPETIZER_INTERVAL_TIME * orderItem.quantity;
                        break;
                    case MenuItemCategory.DESSERTS:
                        orderItemIntervalAmount = DESSERT_INTERVAL_TIME * orderItem.quantity;
                        break;
                    case MenuItemCategory.SUBS:
                        orderItemIntervalAmount = SUBS_INTERVAL_TIME;
                        break;
                    case MenuItemCategory.BEVERAGES:
                        continue;
                    default:
                        continue;
                }

                AvailableOrderTime currentAvailableOrderTime = availableTimes.get(order.requestedPickupTime);
                OffsetDateTime currentIntervalTime = order.requestedPickupTime;
                float tempIntervalTime = orderReservations.getOrDefault(currentIntervalTime, 0f) + orderItemIntervalAmount;

                do {
                    if (currentAvailableOrderTime == null) {
                        throw new Exception("Somehow an order exists that is outside of store hours");
                    }


                    if (tempIntervalTime > MAX_INTERVAL_TIME) {
                        orderReservations.put(currentIntervalTime, MAX_INTERVAL_TIME);
                        currentAvailableOrderTime.isAvailable = false;
                    } else {
                        orderReservations.put(currentIntervalTime, tempIntervalTime);
                        currentAvailableOrderTime.isAvailable = !(tempIntervalTime == MAX_INTERVAL_TIME);
                    }

                    tempIntervalTime -= MAX_INTERVAL_TIME;

                    availableTimes.put(currentIntervalTime, currentAvailableOrderTime);

                    currentIntervalTime = currentIntervalTime.plusMinutes(15);
                    currentAvailableOrderTime = availableTimes.get(currentIntervalTime);
                } while (tempIntervalTime > 0);
            }
        };

        return List.of();
    }

    public List<OrderDTO> getOrdersByDate(Optional<OffsetDateTime> startMaybe, Optional<OffsetDateTime> endMaybe) {
        OffsetDateTime start, end;
        if (!startMaybe.isPresent() || !endMaybe.isPresent()) {
            DayOfWeek currentDay = DayOfWeek.valueOf(LocalDate.now().getDayOfWeek().name());
            StoreHours currentDayStoreHours = StoreHours.find("day", currentDay).firstResult();
            LocalDate today = LocalDate.now();

            start = LocalDateTime.of(today, currentDayStoreHours.openOrder).atOffset(ZoneOffset.UTC);
            end = LocalDateTime.of(today, currentDayStoreHours.closeOrder).atOffset(ZoneOffset.UTC);
        } else {
            start = startMaybe.get();
            end = endMaybe.get();
        }

        return OrderRepository.INSTANCE.getAllOrders(start, end);
    }
}
