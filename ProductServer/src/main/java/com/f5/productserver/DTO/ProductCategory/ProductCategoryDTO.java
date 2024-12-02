package com.f5.productserver.DTO.ProductCategory;

import lombok.*;

import java.util.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductCategoryDTO {
    private int pcId;
    private String value;
}
