package com.ecommerce.template.service;

import com.ecommerce.template.dto.PaymentRequestDTO;
import com.ecommerce.template.model.Order;
import com.ecommerce.template.model.OrderStatus;
import com.ecommerce.template.repository.OrderRepository;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.resources.payment.Payment;

// Imports de Preferencia
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferencePayerRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.preference.Preference;
import com.mercadopago.exceptions.MPApiException;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor; // ✨ Lombok

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor // 1. Genera constructor para los campos 'final'
public class PaymentService {

    // 2. Inyección robusta: Repositorio como 'final'
    private final OrderRepository orderRepository;

    // 3. Variables de configuración (Spring las inyecta después del constructor)
    @Value("${mercadopago.access-token}")
    private String accessToken;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @PostConstruct
    public void init() {
        MercadoPagoConfig.setAccessToken(accessToken);
    }

    // 1. PROCESAR PAGO (BRICK)
    public Payment processPayment(PaymentRequestDTO request) {
        try {
            Order order = orderRepository.findById(request.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

            PaymentClient client = new PaymentClient();

            PaymentCreateRequest paymentCreateRequest = PaymentCreateRequest.builder()
                    .transactionAmount(request.getTransactionAmount())
                    .token(request.getToken())
                    .description("PixelArt Show - Orden #" + order.getId())
                    .installments(request.getInstallments())
                    .paymentMethodId(request.getPaymentMethodId())
                    .payer(PaymentPayerRequest.builder()
                            .email(request.getPayer().getEmail())
                            .build())
                    .externalReference(order.getId().toString())
                    .build();

            Payment payment = client.create(paymentCreateRequest);

            if ("approved".equals(payment.getStatus())) {
                order.setStatus(OrderStatus.PAGADO);
                orderRepository.save(order);
            }

            return payment;

        } catch (Exception e) {
            e.printStackTrace(); // Recomendación: Usar Logger en lugar de printStackTrace
            throw new RuntimeException("Error al procesar el pago con MP: " + e.getMessage());
        }
    }

    // 2. CREAR PREFERENCIA (BOTÓN WALLET)
    @Transactional
    public String createPreference(Long orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

            // 🛡️ BLINDAJE: Aseguramos que la URL nunca sea nula o vacía
            String urlBase = (frontendUrl != null && !frontendUrl.isBlank()) ? frontendUrl : "http://localhost:5173";

            // 4. LÓGICA SIMPLIFICADA: Confiamos en el @Value
            // Esto tomará lo que haya en application.properties o localhost por defecto
            String successUrl = urlBase + "/profile";
            String failureUrl = urlBase + "/cart";

            System.out.println("🔹 URL Base usada: " + urlBase); // Log para verificar

            // --- 1. ITEM ---
            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .title("GamerStore - Compra #" + order.getId())
                    .quantity(1)
                    .unitPrice(order.getTotal())
                    .currencyId("ARS")
                    .build();

            List<PreferenceItemRequest> items = new ArrayList<>();
            items.add(itemRequest);

            // --- 2. PAYER ---
            String userEmail = (order.getUser() != null) ? order.getUser().getEmail() : "guest@pixelart.com";
            PreferencePayerRequest payerRequest = PreferencePayerRequest.builder()
                    .email(userEmail)
                    .build();

            // --- 3. BACK URLS (Redirección al terminar pago) ---
            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success(successUrl)
                    .failure(failureUrl)
                    .pending(successUrl) // Usualmente 'pending' también va a una página de éxito o espera
                    .build();

            // --- 4. REQUEST ---
            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    .payer(payerRequest)
                    .backUrls(backUrls)
                    // .autoReturn("approved") // ✨ Recomendación: Actívalo para mejorar UX (vuelve solo a tu web)
                    .externalReference(order.getId().toString())
                    .build();

            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            return preference.getId();

        } catch (MPApiException e) {
            throw new RuntimeException("MP Error: " + e.getApiResponse().getContent());
        } catch (Exception e) {
            throw new RuntimeException("Error interno: " + e.getMessage());
        }
    }

    // 3. CONSULTAR ESTADO DE PAGO (Para Webhook)
    public Payment getPaymentById(Long paymentId) {
        try {
            PaymentClient client = new PaymentClient();
            return client.get(paymentId);
        } catch (MPApiException e) {
            throw new RuntimeException("Error al consultar pago MP: " + e.getApiResponse().getContent());
        } catch (Exception e) {
            throw new RuntimeException("Error interno consultando pago: " + e.getMessage());
        }
    }
}