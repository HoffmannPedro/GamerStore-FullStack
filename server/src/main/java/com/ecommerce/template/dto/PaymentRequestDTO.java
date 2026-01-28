package com.ecommerce.template.dto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class PaymentRequestDTO {
    private Long orderId; // Para saber qué estamos pagando
    private String token; // El token de la tarjeta que genera el Brick
    private String issuerId;
    private String paymentMethodId; // "master", "visa", etc.
    private BigDecimal transactionAmount;
    private Integer installments; // Cuotas
    private String deliveryMethod;
    private String shippingAddress;
    
    // Datos del pagador (Payer)
    private PayerDTO payer;

    @Getter @Setter
    public static class PayerDTO {
        private String email;
        private IdentificationDTO identification;
    }

    @Getter @Setter
    public static class IdentificationDTO {
        private String type; // DNI, CPF, etc.
        private String number;
    }
}