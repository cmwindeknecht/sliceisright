package com.SliceIsRight.api.responses;

import java.util.Optional;

import lombok.Builder;

@Builder
public class OkayResponse {
    public Optional<Object> entity;
    public String response;
}