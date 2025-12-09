package com.SliceIsRight.api.models;

import com.SliceIsRight.Constants.Size;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MenuItemSizeDTO {
    public long id;
    
    @Enumerated(EnumType.STRING)
    public Size size;

    public Double price;
}