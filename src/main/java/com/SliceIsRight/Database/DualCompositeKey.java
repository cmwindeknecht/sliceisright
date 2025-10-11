package com.SliceIsRight.database;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;
import lombok.Builder;

@Builder
@Embeddable
public class DualCompositeKey implements Serializable {
    public Long primaryId;
    public Long secondaryId;
    
    // Constructor
    public DualCompositeKey() {}
    
    public DualCompositeKey(Long field1, Long field2) {
        this.primaryId = field1;
        this.secondaryId = field2;
    }
    
    @Override
    public boolean equals(Object other) {
        if (this == other) return true;

        if (other == null) return false;
        if (this.getClass() != other.getClass()) return false;

        DualCompositeKey that = (DualCompositeKey) other;
        return Objects.equals(primaryId, that.primaryId) && 
               Objects.equals(secondaryId, that.secondaryId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(primaryId, secondaryId);
    }
}