package com.SliceIsRight.api.model;

import java.time.DayOfWeek;
import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor   
@NoArgsConstructor 
public class AvailableOrderTime {
    public DayOfWeek day;
    public OffsetDateTime time; 
    public boolean isAvailable;
    public float currentOrderAmount; 
}