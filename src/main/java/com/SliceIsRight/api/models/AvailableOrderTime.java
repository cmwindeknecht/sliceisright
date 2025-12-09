package com.SliceIsRight.api.models;

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
    // how many credits are used of the time interval
    public float intervalAmount; 
    // max amount of credits available per time interval
    public float maxIntervalAmount;
}