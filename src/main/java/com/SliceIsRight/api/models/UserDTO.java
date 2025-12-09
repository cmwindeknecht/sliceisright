package com.SliceIsRight.api.models;

import com.SliceIsRight.database.entities.CustomerOrder;

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
    public CustomerOrder[] previousOrders;
}
