package com.f5.paymentserver.Service.Payment;

import com.f5.paymentserver.DTO.Payment.*;
import com.f5.paymentserver.Entity.Payment.OrderEntity;
import com.siot.IamportRestClient.exception.IamportResponseException;

import java.io.IOException;

public interface PaymentService {
    GlobalResponseDTO createImportPayment(PaymentRequestDTO paymentRequestDTO) throws IamportResponseException, IOException;
    //GlobalResponseDTO createPayment(OrderEntity order, String paymentUid);
    ResponseDTO readPaymentByConsumer(String purchaser);
    GlobalResponseDTO deletePayment(Long paymentId);
}
