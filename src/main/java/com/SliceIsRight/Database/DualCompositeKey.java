package com.SliceIsRight.database;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class DualCompositeKey implements Serializable {
    @Setter @Getter
    public Long menuItemId;
    @Setter @Getter
    public Long ingredientId;
}