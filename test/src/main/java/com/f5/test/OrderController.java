package com.f5.test;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
public class OrderController {
    private final OrderService orderService;
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/create-order-list")
    public OrderResponseDTO createOrder(@RequestPart("order") OrderDTO orderDTO,
                                        @RequestPart("orderProduct") List<OrderProductDTO> orderItemList){
        logger.info("OrderController - createOrder: Creating order...");
        OrderResponseDTO response = orderService.createOrderList(orderDTO, orderItemList);
        if(response.getResult().equals("success")){
            logger.info("OrderController - createOrder: Order creation successful");
        } else {
            logger.error("OrderController - createOrder: Failed to create order");
        }
        return response;
    }
}