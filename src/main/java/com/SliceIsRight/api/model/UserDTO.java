package com.SliceIsRight.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor   
@NoArgsConstructor 
public class UserDTO {
    public String email;
    public String jwtToken;
    // TODO add previous orders and whatever else makes sense
}
