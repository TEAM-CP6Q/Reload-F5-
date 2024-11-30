package com.f5.productserver.DAO.Product;

import com.f5.productserver.DTO.Product.ProductDTO;
import com.f5.productserver.DTO.ProductCategory.ProductCategoryDTO;
import com.f5.productserver.Entity.Product.ProductEntity;
import com.f5.productserver.Entity.ProductCategory.ProductCategoryEntity;
import com.f5.productserver.Repository.Product.ProductRepository;
import com.f5.productserver.Repository.ProductCategory.ProductCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductDAOImpl implements ProductDAO {
    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;

    @Override
    public void insertProduct(ProductDTO  productDTO) {
        try {
            ProductEntity productEntity = ProductEntity.builder()
                    .pId(productDTO.getPId())
                    .name(productDTO.getName())
                    .content(productDTO.getContent())
                    .price(productDTO.getPrice())
                    .createdOn(productDTO.getCreatedOn())
                    .modifiedOn(productDTO.getModifiedOn())
                    .categoryIndex(productDTO.getCategoryIndex())
//                    .designerIndex(productDTO.getDesignerIndex())
//                    .imageIndex(productDTO.getImageIndex())
                    .build();
            productRepository.save(productEntity);
        } catch (Exception e) {
            throw new IllegalStateException("상품 등록 실패", e);
        }
    }

    @Override
    public void insertProductCategory(ProductCategoryDTO productCategoryDTO) {
        try {
            ProductCategoryEntity productCategory = ProductCategoryEntity.builder()
                    .pcId(productCategoryDTO.getPcId())
                    .value(productCategoryDTO.getValue())
                    .build();
            productCategoryRepository.save(productCategory);
        } catch (Exception e) {
            throw new IllegalStateException("카테고리 등록 실패", e);
        }
    }

    @Override
    public List<ProductDTO> findAllProducts() {
        List<ProductEntity> entities = productRepository.findAll(); // 모든 상품을 조회
        return entities.stream()
                .map(entity -> ProductDTO.builder()
                        .pId(entity.getPId())
                        .name(entity.getName())
                        .content(entity.getContent())
                        .price(entity.getPrice())
                        .createdOn(entity.getCreatedOn())
                        .modifiedOn(entity.getModifiedOn())
                        .categoryIndex(entity.getCategoryIndex())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> findProductsByCategory(String value) {
        List<ProductEntity> entities = productRepository.findAllByCategoryIndex_Value(value);
        return entities.stream()
                .map(entity -> ProductDTO.builder()
                        .pId(entity.getPId())
                        .name(entity.getName())
                        .content(entity.getContent())
                        .price(entity.getPrice())
                        .createdOn(entity.getCreatedOn())
                        .modifiedOn(entity.getModifiedOn())
                        .categoryIndex(entity.getCategoryIndex())
//                        .designerIndex(entity.getDesignerIndex())
//                        .imageIndex(entity.getImageIndex())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> findLatestProducts() {
        List<ProductEntity> entities = productRepository.findAllByOrderByCreatedOnDesc();
        return entities.stream()
                .map(entity -> ProductDTO.builder()
                        .pId(entity.getPId())
                        .name(entity.getName())
                        .content(entity.getContent())
                        .price(entity.getPrice())
                        .createdOn(entity.getCreatedOn())
                        .modifiedOn(entity.getModifiedOn())
                        .categoryIndex(entity.getCategoryIndex())
//                        .designerIndex(entity.getDesignerIndex())
//                        .imageIndex(entity.getImageIndex())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> findProductDetails(int pId) {
        Optional<ProductEntity> entities = productRepository.findBypId(pId);
        return entities.stream()
                .map(entity -> ProductDTO.builder()
                        .pId(entity.getPId())
                        .name(entity.getName())
                        .content(entity.getContent())
                        .price(entity.getPrice())
                        .createdOn(entity.getCreatedOn())
                        .modifiedOn(entity.getModifiedOn())
                        .categoryIndex(entity.getCategoryIndex())
//                        .designerIndex(entity.getDesignerIndex())
//                        .imageIndex(entity.getImageIndex())
                        .build())
                .collect(Collectors.toList());
    }
}
