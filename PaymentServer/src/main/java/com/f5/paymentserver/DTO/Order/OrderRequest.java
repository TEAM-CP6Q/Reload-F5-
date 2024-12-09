package com.f5.paymentserver.DTO.Order;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private OrderDTO orderDTO;
    private List<OrderProductDTO> orderItemList;
}
