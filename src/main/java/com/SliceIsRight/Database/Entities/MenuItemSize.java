package com.SliceIsRight.database.entities;

import com.SliceIsRight.Constants.Size;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "t_menu_item_size")
public class MenuItemSize extends PanacheEntity {
    @ManyToOne
    public MenuItem menuItem;
    
    @Enumerated(EnumType.STRING)
    public Size size;

    public Double price;
}




