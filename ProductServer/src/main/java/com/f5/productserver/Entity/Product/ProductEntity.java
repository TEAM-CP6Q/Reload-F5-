package com.f5.productserver.Entity.Product;

import com.f5.productserver.Entity.ProductCategory.ProductCategoryEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "product")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int pId;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String content;
    @Column(nullable = false)
    private int price;
    @Column(nullable = false)
    private boolean soldOut;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date createdOn;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date modifiedOn;
    @ManyToOne
    @JoinColumn(name = "pc_Id",referencedColumnName = "pcId", nullable = false)
    private ProductCategoryEntity categoryIndex;
    @Column(nullable = false)
    private Long imageIndex;
    @Column(nullable = false)
    private Long designerIndex;

}
