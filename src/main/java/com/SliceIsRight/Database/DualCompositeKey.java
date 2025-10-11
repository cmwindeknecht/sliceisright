package com.SliceIsRight.database;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;

@Embeddable
public class DualCompositeKey implements Serializable {
    public String field1;
    public String field2;
    
    // Constructor
    public DualCompositeKey() {}
    
    public DualCompositeKey(String field1, String field2) {
        this.field1 = field1;
        this.field2 = field2;
    }
    
    @Override
    public boolean equals(Object other) {
        if (this == other) return true;

        if (other == null) return false;
        if (this.getClass() != other.getClass()) return false;

        DualCompositeKey that = (DualCompositeKey) other;
        return Objects.equals(field1, that.field1) && 
               Objects.equals(field2, that.field2);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(field1, field2);
    }
}