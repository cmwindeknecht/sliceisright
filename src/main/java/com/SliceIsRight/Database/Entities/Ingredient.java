package com.SliceIsRight.Database.Entities;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class Ingredient extends PanacheEntity {
    public float price;
    public String name;
}
