package com.f5.productserver.DAO.Product;

import com.f5.productserver.Controller.Product.ProductController;
import com.f5.productserver.DTO.Product.ProductDTO;
import com.f5.productserver.DTO.ProductCategory.ProductCategoryDTO;
import com.f5.productserver.Entity.Product.ProductEntity;
import com.f5.productserver.Entity.ProductCategory.ProductCategoryEntity;
import com.f5.productserver.Repository.Product.ProductRepository;
import com.f5.productserver.Repository.ProductCategory.ProductCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductDAOImpl implements ProductDAO {
    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    @Override
    public void insertProduct(ProductDTO productDTO) {
        try {
            ProductEntity productEntity = ProductEntity.builder()
                    .name(productDTO.getName())
                    .content(productDTO.getContent())
                    .price(productDTO.getPrice())
                    .soldOut(productDTO.isSoldOut())
                    .createdOn(new Date())
                    .modifiedOn(new Date())
                    .categoryIndex(productDTO.getCategoryIndex())
                    .designerIndex(productDTO.getDesignerIndex())
                    .build();

            // ProductEntity 저장
            productRepository.save(productEntity);

            // 저장된 ID로 imageUrls 설정 후 저장
            if (productDTO.getImageUrls() != null) {
                productEntity.setImageUrls(productDTO.getImageUrls());
                productRepository.save(productEntity);
            }
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
                        .soldOut(entity.isSoldOut())
                        .createdOn(entity.getCreatedOn())
                        .modifiedOn(entity.getModifiedOn())
                        .categoryIndex(entity.getCategoryIndex())
                        .imageUrls(entity.getImageUrls())
                        .designerIndex(entity.getDesignerIndex())
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
                        .soldOut(entity.isSoldOut())
                        .createdOn(entity.getCreatedOn())
                        .modifiedOn(entity.getModifiedOn())
                        .categoryIndex(entity.getCategoryIndex())
                        .imageUrls(entity.getImageUrls())
                        .designerIndex(entity.getDesignerIndex())
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
                        .soldOut(entity.isSoldOut())
                        .createdOn(entity.getCreatedOn())
                        .modifiedOn(entity.getModifiedOn())
                        .categoryIndex(entity.getCategoryIndex())
                        .imageUrls(entity.getImageUrls())
                        .designerIndex(entity.getDesignerIndex())
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
                        .soldOut(entity.isSoldOut())
                        .createdOn(entity.getCreatedOn())
                        .modifiedOn(entity.getModifiedOn())
                        .categoryIndex(entity.getCategoryIndex())
                        .imageUrls(entity.getImageUrls())
                        .designerIndex(entity.getDesignerIndex())
                        .build())
                .collect(Collectors.toList());
    }
}
