package com.f5.productserver.Repository.Product;

import com.f5.productserver.Entity.Product.ProductEntity;
import com.f5.productserver.Entity.ProductCategory.ProductCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
    Optional<ProductEntity> findBypId(int index);
    List<ProductEntity> findAll();
    List<ProductEntity> findAllByOrderByCreatedOnDesc();
    List<ProductEntity> findAllByCategoryIndex_Value(String value);
    ProductEntity findAllBypId(Long id);
    boolean existsBypId(Long id);
}
