package com.f5.paymentserver.DAO.Order;

import com.f5.paymentserver.Controller.Order.OrderController;
import com.f5.paymentserver.Entity.Payment.OrderEntity;
import com.f5.paymentserver.Repository.Order.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;

@Repository
public class OrderDAOImpl implements OrderDAO{
    private final OrderRepository orderRepository;
    //    private final CartRepository cartRepository;
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    public OrderDAOImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
//        this.cartRepository = cartRepository;
    }

    @Override
    public Map<String, Object> createPayment(OrderEntity order) {
        Map<String, Object> result = new HashMap<>();
        order.setCreatedOn(LocalDateTime.now());
        logger.info("크리에이트페이먼즈 : {}", order.getMerchantUid());
        orderRepository.save(order);

        result.put("result", "success");
        return result;
    }

    @Override
    public void deleteOrderList(Long id) {
        try{
            if(orderRepository.existsById(id)) {
                OrderEntity order = orderRepository.findAllById(id);
                orderRepository.delete(order);
            } else {
                throw new IllegalStateException("해당 아이디의 주문내역이 없음");
            }
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("주문내역 삭제 중 오류 발생"+ e.getMessage(), e);
        }
    }

    @Override
    public List<OrderEntity> readOrderDetail(String name) {
        return orderRepository.findByConsumer(name);
    }

    @Override
    public OrderEntity readOrder(Long orderId) {
        return orderRepository.getReferenceById(orderId);
    }

    @Override
    public void deleteOrder(OrderEntity order){
        orderRepository.delete(order);
    }
}
