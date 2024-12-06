package com.f5.paymentserver.Controller.Order;

import com.f5.paymentserver.DTO.Order.OrderRequest;
import com.f5.paymentserver.DTO.Order.OrderResponseDTO;
import com.f5.paymentserver.Entity.Payment.OrderEntity;
import com.f5.paymentserver.Service.Order.OrderService;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payment/order")
public class OrderController {
    private final OrderService orderService;
    private final HttpSession httpSession;
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    public OrderController(OrderService orderService, HttpSession httpSession) {
        this.orderService = orderService;
        this.httpSession = httpSession;
    }

    // 장바구니 담긴애들
//    @PostMapping("/create-basket-order-list")
//    public ResponseEntity<?> createOrderBasketList(@RequestBody Map<String, Object> payload) {
//        // 카트 번호
//        List<Integer> cartIdsInteger = (List<Integer>) payload.get("cartIds");
//        List<Long> cartIds = cartIdsInteger.stream().map(Long::valueOf).collect(Collectors.toList());
//        OrderEntity temporaryOrder = orderService.createTempOrder(cartIds);
//        // 세션에 임시 주문 정보를 저장
//        httpSession.setAttribute("temporaryOrder", temporaryOrder);
//        httpSession.setAttribute("cartIds", cartIds); // 장바구니 id 저장
//
//        Object cartIdsAttribute = httpSession.getAttribute("cartIds");
//
//        return ResponseEntity.ok("주문 임시 저장 완료");
//    }

//    @PostMapping("/order-done")
//    public ResponseEntity<?> completeOrder(
//            @RequestPart("order") OrderDTO orderDTO,
//            @RequestPart("orderProduct") List<OrderProductDTO> orderProductList) {
//        // 세션에서 임시 주문 정보를 가져옴
//        OrderEntity temporaryOrder = (OrderEntity) httpSession.getAttribute("temporaryOrder");
//        if (temporaryOrder == null) {
//            logger.error("completeOrder - 임시 주문 정보를 찾을 수 없습니다.");
//            return ResponseEntity.badRequest().body(null);
//        }
//        // 주문 확정 처리
//        OrderEntity completedOrder = orderService.orderConfirm(temporaryOrder, orderDTO, orderProductList);
//        if (completedOrder != null) {
//            logger.info("completeOrder - 주문 완료: 주문 ID {}", completedOrder.getId());
//            OrderResponseDTO response = new OrderResponseDTO(completedOrder);
//            return ResponseEntity.ok(response);
//        } else {
//            logger.error("completeOrder - 주문 처리 실패");
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }

//        @PostMapping("/create-order-list")
//    public OrderResponseDTO createOrder(@RequestPart OrderDTO orderDTO,
//                                        @RequestPart List<OrderProductDTO> orderItemList){
//        OrderResponseDTO response = orderService.createOrderList(orderDTO, orderItemList);
//        if(response.getResult().equals("success")){
//            logger.info("OrderController - createOrderList: Order creation successful");
//        } else {
//            logger.error("OrderController - createOrderList: Failed to create order list");
//        }
//        return response;
//    }

    @PostMapping("/create-order-list")
    public OrderResponseDTO createOrder(@RequestBody OrderRequest request){
        OrderResponseDTO response = orderService.createOrderList(request.getOrderDTO(), request.getOrderItemList());
        logger.info("컨트롤러에서 만든 response : {}", response.getMerchantUid());
        if(response.getResult().equals("success")){
            logger.info("OrderController - createOrderList: Order creation successful");
        } else {
            logger.error("OrderController - createOrderList: Failed to create order list");
        }
        return response;
    }

    @GetMapping("/order-detail/{username}")
    public ResponseEntity<?> getOrderDetail(@PathVariable("username") String username) {
        try {
            // 사용자 정보를 이용해 주문 내역 조회
            List<OrderEntity> orders = orderService.findByOrderConsumer(username);

            if (orders.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "해당 사용자의 주문 내역이 없습니다."));
            }

            // 주문 상세정보를 Map 형태로 변환
            List<Map<String, Object>> orderDetails = orders.stream().map(order -> {
                Map<String, Object> orderDetail = new HashMap<>();
                orderDetail.put("orderId", order.getId());
                orderDetail.put("orderConsumer", order.getConsumer());
                orderDetail.put("orderDate", order.getCreatedOn());
                orderDetail.put("totalPrice", order.getTotalPrice());
                orderDetail.put("merchantUid", order.getMerchantUid());

                // 각 주문의 상품 정보를 추가
                List<Map<String, Object>> products = order.getOrderProductList().stream().map(product -> {
                    Map<String, Object> productDetail = new HashMap<>();
                    productDetail.put("orderProductId", product.getProductId());
                    productDetail.put("price", product.getPrice());
                    productDetail.put("amount", product.getAmount());
                    return productDetail;
                }).collect(Collectors.toList());

                orderDetail.put("products", products);
                return orderDetail;
            }).collect(Collectors.toList());

            // 응답 Map 생성
            Map<String, Object> response = new HashMap<>();
            response.put("username", username);
            response.put("orderDetails", orderDetails);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "서버 오류가 발생했습니다.", "error", e.getMessage()));
        }
    }


    @DeleteMapping("/delete-order-list/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable("id") Long id) {
        try{
            orderService.deleteOrderList(id);
            return ResponseEntity.ok("주문내역 삭제 성공");
        } catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
