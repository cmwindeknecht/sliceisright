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

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "t_store_hour")
public class StoreHours extends PanacheEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    public DayOfWeek day;

    @Column(nullable = false)
    public LocalTime open;

    @Column(nullable = false)
    public LocalTime openOrder;

    @Column(nullable = false)
    public LocalTime close;

    @Column(nullable = false)
    public LocalTime closeOrder;  
}
