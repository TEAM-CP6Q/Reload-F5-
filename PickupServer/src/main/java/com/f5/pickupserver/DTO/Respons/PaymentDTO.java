package com.f5.pickupserver.DTO.Respons;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PaymentDTO {
    private Long pickupId;
    private String merchantUid;  // 주문번호
}
