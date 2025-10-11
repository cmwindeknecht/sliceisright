package com.SliceIsRight.api.responses;

import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor   
@NoArgsConstructor 
public class OkayResponse {
    public Optional<Object> entity;
    public String response;
}