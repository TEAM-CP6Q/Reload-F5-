package com.f5.productserver.DTO.Product;

import com.f5.productserver.Entity.ProductCategory.ProductCategoryEntity;
import lombok.*;
import java.util.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductDTO {
    private int pId;
    private String name;
    private String content;
    private int price;
    private boolean soldOut;
    private Date createdOn;
    private Date modifiedOn;
    private ProductCategoryEntity categoryIndex;
    private Long imageIndex;
}
