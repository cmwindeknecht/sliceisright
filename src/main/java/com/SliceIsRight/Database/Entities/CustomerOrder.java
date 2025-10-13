package com.SliceIsRight.database.entities;

import java.time.OffsetDateTime;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor   
@NoArgsConstructor 
public class CustomerOrder extends PanacheEntity {
    public long userId;
    public OffsetDateTime eventTimestamp;
}