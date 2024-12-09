package com.f5.productserver.DAO.Product;

import com.f5.productserver.DTO.Product.ProductDTO;
import com.f5.productserver.DTO.ProductCategory.ProductCategoryDTO;

import java.util.List;

public interface ProductDAO {
    void insertProduct(ProductDTO productDTO);
    ;
    // 최신 상품 찾는 것.
    List<ProductDTO> findAllProducts();
    List<ProductDTO> findLatestProducts();
    List<ProductDTO> findProductsByCategory(String value);
    List<ProductDTO> findProductDetails(int pId);
    void deleteProduct(Long id);

    // 상품 카테고리 관련
    void insertProductCategory(ProductCategoryDTO productCategoryDTO);
    void deleteProductCategory(int id);
    List<ProductCategoryDTO> findAllProductCategorys();
    void updateProductCategory(ProductCategoryDTO productCategoryDTO);
}
