package com.SliceIsRight.database.entities;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.OffsetDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "t_store_hour")
public class StoreHours extends PanacheEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    public DayOfWeek day;

    // When the store opens
    @Column(nullable = false)
    public OffsetDateTime open;

    // First order time of the day allowed
    @Column(nullable = false)
    public OffsetDateTime openOrder;

    // When the store closes
    @Column(nullable = false)
    public OffsetDateTime close;

    // Last order time of the day allowed
    @Column(nullable = false)
    public OffsetDateTime closeOrder;  
}
