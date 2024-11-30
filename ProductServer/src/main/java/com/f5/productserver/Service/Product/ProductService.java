package com.f5.productserver.Service.Product;


import com.f5.productserver.DTO.Product.ProductDTO;
import com.f5.productserver.DTO.ProductCategory.ProductCategoryDTO;

import java.util.List;

public interface ProductService {
    void insertProduct(ProductDTO products);
    void insertProductCategory(ProductCategoryDTO productCategoryDTO);
    List<ProductDTO> getAllProducts(String value);
    List<ProductDTO> getLatestProducts();
    List<ProductDTO> getProductDetails(int pId);
}
