package com.SliceIsRight.api.model;

import java.time.OffsetDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import com.SliceIsRight.Constants.OrderStatus;

@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private Long id;
    private String userEmail;
    private OffsetDateTime placedDateTime;
    private OffsetDateTime requestedPickupTime;
    private OffsetDateTime pickedUpDateTime;
    private OrderStatus orderStatus;
    private List<OrderItemDTO> orderItems;
}
