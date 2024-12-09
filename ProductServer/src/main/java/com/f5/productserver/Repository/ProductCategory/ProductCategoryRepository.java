package com.f5.productserver.Repository.ProductCategory;

import com.f5.productserver.Entity.Product.ProductEntity;
import com.f5.productserver.Entity.ProductCategory.ProductCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductCategoryRepository  extends JpaRepository<ProductCategoryEntity, Long> {
    boolean existsBypcId(int id);
    ProductCategoryEntity findAllBypcId(int id);
    List<ProductCategoryEntity> findAll();
}
