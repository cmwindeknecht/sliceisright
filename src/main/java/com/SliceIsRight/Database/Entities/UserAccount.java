package com.SliceIsRight.database.entities;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor   
@NoArgsConstructor 
@Table(name = "t_user_account")
public class UserAccount extends PanacheEntity {
    @Column(unique = true)
    public String email;
    public String hashedPassword;
    public boolean adminPriveleges = false;
}