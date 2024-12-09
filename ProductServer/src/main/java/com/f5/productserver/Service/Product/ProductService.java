package com.f5.productserver.Service.Product;


import com.f5.productserver.DTO.Product.ProductDTO;
import com.f5.productserver.DTO.ProductCategory.ProductCategoryDTO;

import java.util.List;

public interface ProductService {
    ProductDTO insertProduct(ProductDTO products);
    List<ProductDTO> getAllProducts(String value);
    List<ProductDTO> getLatestProducts();
    List<ProductDTO> getProductDetails(int pId);
    void deleteProduct(Long id);

    // 상품 카테고리 관련
    void insertProductCategory(ProductCategoryDTO productCategoryDTO);
    List<ProductCategoryDTO> getProductCategory();
    void updateProductCategory(ProductCategoryDTO productCategoryDTO);
    void deleteProductCategory(int id);



}