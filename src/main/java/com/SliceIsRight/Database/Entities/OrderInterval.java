package com.SliceIsRight.database.entities;

import com.SliceIsRight.Constants.IntervalCategory;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "t_order_interval")
public class OrderInterval extends PanacheEntity {   
    @Enumerated(EnumType.STRING)
    public IntervalCategory category; // Which type of item this applies to

    public float amount; // How much the category affects the interval
}

