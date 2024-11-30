package com.f5.productserver.Entity.ProductCategory;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_category")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductCategoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int pcId;
    @Column(nullable = false)
    private String value;
}
