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

    public void deleteProduct(Long id) {
        try{
            if(productRepository.existsBypId(id)) {
                ProductEntity product = productRepository.findAllBypId(id);
                productRepository.delete(product);
            } else {
                throw new IllegalStateException("해당 아이디의 상품이 없음");
            }
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("상품 삭제 중 오류 발생"+ e.getMessage(), e);
        }
    }

    public void deleteProductCategory(int id) {
        try {
            if(productCategoryRepository.existsBypcId(id)) {
                ProductCategoryEntity productCategory = productCategoryRepository.findAllBypcId(id);
                productCategoryRepository.delete(productCategory);
            }else {
                throw new IllegalStateException("해당 아이디의 상품 카테고리가 없음");
            }
        }catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("상품 카테고리 삭제 중 오류 발생" + e.getMessage(), e);
        }
    }

    @Override
    public List<ProductCategoryDTO> findAllProductCategorys() {
        List<ProductCategoryEntity> categorys = productCategoryRepository.findAll();
        return categorys.stream()
                .map(entity -> ProductCategoryDTO.builder()
                        .pcId(entity.getPcId())
                        .value(entity.getValue())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public void updateProductCategory(ProductCategoryDTO productCategoryDTO) {
        try {
            ProductCategoryEntity existingCategory = productCategoryRepository.findAllBypcId(productCategoryDTO.getPcId());
            if(existingCategory == null) {
                throw new IllegalStateException("pcId에 관한 카테고리 정보가 없습니다.");
            }
            existingCategory.setPcId(productCategoryDTO.getPcId());
            existingCategory.setValue(productCategoryDTO.getValue());

            productCategoryRepository.save(existingCategory);
        } catch (Exception e) {
            throw new IllegalStateException("카테고리 정보 업데이트 실패", e);
        }
    }
}