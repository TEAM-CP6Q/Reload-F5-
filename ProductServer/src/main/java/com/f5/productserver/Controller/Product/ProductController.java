package com.f5.productserver.Controller.Product;

import com.f5.productserver.DTO.Product.ProductDTO;
import com.f5.productserver.DTO.ProductCategory.ProductCategoryDTO;
import com.f5.productserver.Service.Communication.CommunicationService;
import com.f5.productserver.Service.Product.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product")
public class ProductController {
    private final ProductService productService;
    private final CommunicationService communicationService;

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
    @PostMapping("/add-product")
    public ResponseEntity<?> addProducts(@RequestBody ProductDTO product) {
        try{
            productService.insertProduct(product);
            return ResponseEntity.ok("상품 등록 성공");
        } catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

//    @PostMapping("/add-product-category")
//    public ResponseEntity<?> addProductCategory(@RequestBody ProductCategoryDTO productCategoryDTO) {
//        try{
//            productService.insertProductCategory(productCategoryDTO);
//            return ResponseEntity.ok("카테고리 등록 성공");
//        } catch (IllegalArgumentException e){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }

}
