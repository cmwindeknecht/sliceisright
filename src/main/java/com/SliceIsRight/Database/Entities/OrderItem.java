package com.SliceIsRight.database.entities;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor   
@NoArgsConstructor 
@Table(name = "t_order_item")
public class OrderItem extends PanacheEntity {
        
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    public CustomerOrder order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "menu_item_id", nullable = false)
    public MenuItem menuItem;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "chosen_size_id")
    public MenuItemSize chosenSize;

    @OneToMany(mappedBy = "orderItem", cascade = CascadeType.ALL, orphanRemoval = true)
    public Set<IngredientOption> ingredientOptions = new HashSet<>();

    @Column(nullable = false)
    public Integer quantity;

    public String notes;

    @Column(nullable = false, precision = 10, scale = 2)
    public BigDecimal price;
}
