package com.f5.productserver.Service.Product;

import com.f5.productserver.DAO.Product.ProductDAO;
import com.f5.productserver.DTO.Product.ProductDTO;
import com.f5.productserver.DTO.ProductCategory.ProductCategoryDTO;
import com.f5.productserver.Entity.Product.ProductEntity;
import com.f5.productserver.Entity.ProductCategory.ProductCategoryEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService{
    private final ProductDAO productDAO;


    public ProductServiceImpl(ProductDAO productDAO) {
        this.productDAO = productDAO;
    }

    // 상품등록
    @Override
    public ProductDTO insertProduct(ProductDTO productDTO) {
        try {
            productDAO.insertProduct(productDTO);
        } catch (Exception e) {
            throw new IllegalStateException("상품 등록 실패", e);
        }
        return productDTO;
    }


    // 상품 카테고리 등록
    @Override
    public void insertProductCategory(ProductCategoryDTO productCategoryDTO) {
        try {
            productDAO.insertProductCategory(productCategoryDTO);
        } catch (Exception e) {
            throw new IllegalStateException("카테고리 등록 실패", e);
        }
    }

    //전체 상품조회 + 카테고리별
    @Override
    public List<ProductDTO> getAllProducts(String value) {
        if ("전체".equals(value)) {
            // 전체 상품 반환
            return productDAO.findAllProducts();
        } else {
            // 카테고리 이름으로 ID 조회 후 상품 반환
            List<ProductDTO> category = productDAO.findProductsByCategory(value);
            if (category == null) {
                throw new IllegalArgumentException("존재하지 않는 카테고리입니다: " + value);
            }
            return productDAO.findProductsByCategory(value);
        }
    }

    // 최신상품별 조회
    @Override
    public List<ProductDTO> getLatestProducts() {
        return productDAO.findLatestProducts();
    }

    // 상품 상세정보 조회
    @Override
    public List<ProductDTO> getProductDetails(int pId) {
        return productDAO.findProductDetails(pId);
    }
}
