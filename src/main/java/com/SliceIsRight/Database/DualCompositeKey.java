package com.SliceIsRight.database;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;
import lombok.Builder;

@Builder
@Embeddable
public class DualCompositeKey implements Serializable {
    public Long menuItemId;
    public Long ingredientId;
    
    // Constructor
    public DualCompositeKey() {}
    
    public DualCompositeKey(Long field1, Long field2) {
        this.menuItemId = field1;
        this.ingredientId = field2;
    }
    
    @Override
    public boolean equals(Object other) {
        if (this == other) return true;

        if (other == null) return false;
        if (this.getClass() != other.getClass()) return false;

        DualCompositeKey that = (DualCompositeKey) other;
        return Objects.equals(menuItemId, that.menuItemId) && 
               Objects.equals(ingredientId, that.ingredientId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(menuItemId, ingredientId);
    }
}