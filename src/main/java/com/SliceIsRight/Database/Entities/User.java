package com.SliceIsRight.database.entities;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor   
@NoArgsConstructor 
public class User extends PanacheEntity {
    @Column(unique = true)
    public String email;
    public String hashedPassword;
    public boolean adminPriveleges = false;
}