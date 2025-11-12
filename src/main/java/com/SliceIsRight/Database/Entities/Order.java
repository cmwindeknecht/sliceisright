package com.SliceIsRight.database.entities;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import com.SliceIsRight.Constants.OrderStatus;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor   
@NoArgsConstructor 
@Table(name = "t_order")
public class Order extends PanacheEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    public UserAccount user;

    @Column(nullable = false, updatable = false)
    public OffsetDateTime placedDateTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public OrderStatus orderStatus;

    public OffsetDateTime requestedPickupTime;
    public OffsetDateTime pickedUpDateTime;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<OrderItem> orderItems = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (placedDateTime == null) {
            placedDateTime = OffsetDateTime.now(); 
        }
        if (orderStatus == null) {
            orderStatus = OrderStatus.PLACED;
        }
    }    
}