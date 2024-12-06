package com.f5.test;

import java.util.List;

public interface OrderService {
    OrderResponseDTO createOrderList(OrderDTO orderDTO, List<OrderProductDTO> orderItemDTOList);}
