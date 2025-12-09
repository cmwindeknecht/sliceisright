package com.SliceIsRight.api.models;

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
    public Long id;
    public String userEmail;
    public OffsetDateTime placedDateTime;
    public OffsetDateTime requestedPickupTime;
    public OffsetDateTime pickedUpDateTime;
    public OrderStatus orderStatus;
    public List<OrderItemDTO> orderItems;
}
