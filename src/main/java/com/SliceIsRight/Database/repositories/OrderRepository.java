package com.SliceIsRight.database.repositories;

import java.time.OffsetDateTime;
import java.util.List;

import com.SliceIsRight.api.models.OrderDTO;
import com.SliceIsRight.database.entities.CustomerOrder;
import com.SliceIsRight.database.entities.UserAccount;

public class OrderRepository {
    public static final OrderRepository INSTANCE = new OrderRepository();

    public List<OrderDTO> getAllOrders(OffsetDateTime start, OffsetDateTime end) {
        String query = "SELECT DISTINCT o FROM Order o " +
                    "LEFT JOIN FETCH o.orderItems oi " +
                    "LEFT JOIN FETCH oi.ingredientOptions " +
                    "LEFT JOIN FETCH oi.menuItem " +
                    "LEFT JOIN FETCH oi.chosenSize " +
                    "LEFT JOIN FETCH o.user " +
                    "WHERE o.placedDateTime BETWEEN ?1 AND ?2";

        List<CustomerOrder> orders = CustomerOrder.find(query, start, end).list();

        List<OrderDTO> orderDTOs = buildOrderDTOs(orders);
        return orderDTOs;
    }

    public List<OrderDTO> getOrdersByUser(UserAccount user) {
        List<CustomerOrder> orders = CustomerOrder.find(
            "SELECT DISTINCT o FROM Order o " +
            "LEFT JOIN FETCH o.orderItems oi " +
            "LEFT JOIN FETCH oi.ingredientOptions " +
            "LEFT JOIN FETCH oi.menuItem " +
            "LEFT JOIN FETCH oi.chosenSize " +
            "WHERE o.user = ?1",
            user
        ).list();

        
        List<OrderDTO> orderDTOs = buildOrderDTOs(orders);
        return orderDTOs;
    }

    private List<OrderDTO> buildOrderDTOs(List<CustomerOrder> orders) {    
        return List.of();
        // menuItems.stream()
        //     .map(menuItem -> helper.buildMenuItemDTO(menuItem))
        //     .collect(Collectors.toList());
    }
}
