package com.SliceIsRight.api.model;

import com.SliceIsRight.database.entities.Order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor   
@NoArgsConstructor 
public class UserDTO {
    public String email;
    public String jwtToken;
    public boolean isAdmin;
    public Order[] previousOrders;
}
