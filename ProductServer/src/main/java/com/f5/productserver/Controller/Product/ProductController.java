package com.f5.productserver.Controller.Product;

import com.f5.productserver.DTO.Product.ProductDTO;
import com.f5.productserver.DTO.ProductCategory.ProductCategoryDTO;
import com.f5.productserver.Service.Communication.CommunicationService;
import com.f5.productserver.Service.Product.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product")
public class ProductController {
    private final ProductService productService;
    private final CommunicationService communicationService;
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    public ProductController(ProductService productService, CommunicationService communicationService) {
        this.productService = productService;
        this.communicationService = communicationService;
    }

    /*
     * 전체 productlist에서 category별 전체 목록 불러옴
     * value = category의 value(ex. 가구, 전체 등)
     * */
    @GetMapping("/product-list/{value}")
    public ResponseEntity<?> getAllProducts(@PathVariable String value) {
        try {
            List<ProductDTO> products = productService.getAllProducts(value);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류: " + e.getMessage());
        }
    }

    // 최초 메인페이지에서 최신 상품들 불러오는 product-list
    @GetMapping("/latest-product-list")
    public ResponseEntity<?> getLatestProducts() {
        try {
            List<ProductDTO> products = productService.getLatestProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류: " + e.getMessage());
        }
    }

    @GetMapping("/product-detail/{pId}")
    public ResponseEntity<?> getProductDetails(@PathVariable int pId, @RequestParam Long designerId) {
        try {
            List<ProductDTO> products = productService.getProductDetails(pId);
            String designerName = communicationService.getDesignerById(designerId);
            Map<String, Object> response = new HashMap<>();
            response.put("products", products);
            response.put("designerName", designerName);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류: " + e.getMessage());
        }
    }


    // DB에 상품 등록
    @PostMapping(value = "/add-product", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addProducts(
            @RequestPart(value = "product")  ProductDTO productDTO,
            @RequestPart(value = "images") List<MultipartFile> images) {
        logger.info("Received ProductDTO: {}", productDTO);
        try {
            // 1. 디자이너 ID 가져오기
            if (productDTO.getDesignerIndex() == null) {
                throw new IllegalArgumentException("Designer index is required.");
            }
            Long designerIndex = communicationService.getDesigner(productDTO.getDesignerIndex());
            logger.info("디비에서 받아온 디자이너 인덱스: {}", productDTO.getDesignerIndex());
            // 2. 디자이너 인덱스를 ProductDTO에 설정
            productDTO.setDesignerIndex(designerIndex);

            // 3. 이미지 업로드 및 이미지 URL 설정
            List<String> imageURI = communicationService.uploadImagesToImageServer(images);
            productDTO.setImageUrls(imageURI);
            logger.info("Received imageURI: {}", imageURI);
            // 4. 제품 정보 저장
            ProductDTO createdProduct = productService.insertProduct(productDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("상품 등록 실패: " + e.getMessage());
        }
    }

    // 상품 삭제
    @DeleteMapping("/delete-product/{pId}")
    public ResponseEntity<?> deleteProduct(@PathVariable("pId") Long pId) {
        try {
            productService.deleteProduct(pId);
            return ResponseEntity.ok("상품 삭제 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 상품 카테고리 등록
    @PostMapping("/add-product-category")
    public ResponseEntity<?> addProductCategory(@RequestBody ProductCategoryDTO productCategoryDTO) {
        try{
            productService.insertProductCategory(productCategoryDTO);
            return ResponseEntity.ok("카테고리 등록 성공");
        } catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    //상품 카테고리 수정
    @PatchMapping("/update-category")
    public ResponseEntity<?> updateCategory(@RequestBody ProductCategoryDTO productCategoryDTO) {
        try {
            productService.updateProductCategory(productCategoryDTO);  // 서비스 레이어에서 업데이트 처리
            return ResponseEntity.ok("상품 카테고리 정보가 성공적으로 업데이트되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("상품 카테고리 정보 업데이트에 실패했습니다.");
        }
    }

    // 상품 카테고리 불러오기
    @GetMapping("/category-list")
    public ResponseEntity<?> getCategoryList() {
        try {
            List<ProductCategoryDTO> category = productService.getProductCategory();
            return ResponseEntity.ok(category);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류: " + e.getMessage());
        }
    }

    // 상품 카테고리 삭제
    @DeleteMapping("/delete-category/{pcId}")
    public ResponseEntity<?> deleteProductCategory(@PathVariable("pcId") int pcId) {
        try {
            productService.deleteProductCategory(pcId);
            return ResponseEntity.ok("상품 카테고리 삭제 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}