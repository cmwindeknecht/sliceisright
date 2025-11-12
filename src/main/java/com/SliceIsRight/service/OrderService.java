package com.SliceIsRight.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.SliceIsRight.api.model.AvailableOrderTime;
import com.SliceIsRight.api.model.OrderDTO;
import com.SliceIsRight.database.entities.StoreHours;
import com.SliceIsRight.database.repositories.OrderRepository;

public class OrderService {

    /**
     * Get Available order times in UTC
     * 
     * @param start
     * @param end
     * @return
     */
    public List<AvailableOrderTime> getAvailableOrderTimes(OffsetDateTime start, OffsetDateTime end) {
        List<AvailableOrderTime> availableTimes = new ArrayList<>();
        OffsetDateTime current = start; // working in UTC
        DayOfWeek day = current.getDayOfWeek(); // get day in UTC

        while (!current.isAfter(end)) {
            availableTimes.add(
                AvailableOrderTime.builder()
                    .day(day)
                    .time(current)
                    .build()
            );
            current = current.plusMinutes(15);
        }
        
        // TODO logic to determine if time is available
        //   Pure assumption - 3 pizzas or 6 of anything else = time not avaialble (beverages don't count)
        List<OrderDTO> todaysOrders = getOrdersByDate(Optional.of(start), Optional.of(end));

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
