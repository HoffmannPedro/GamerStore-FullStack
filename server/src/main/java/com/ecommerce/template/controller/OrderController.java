package com.ecommerce.template.controller;

import com.ecommerce.template.dto.PaymentRequestDTO;
import com.ecommerce.template.model.Order;
import com.ecommerce.template.model.OrderStatus;
import com.ecommerce.template.service.OrderService;
import com.ecommerce.template.service.PaymentService;
import com.mercadopago.resources.payment.Payment;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody PaymentRequestDTO request) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Order order = orderService.createOrder(request, userEmail);
        Map<String, Object> response = new HashMap<>();
        response.put("order", order);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/payment/process")
    public ResponseEntity<?> processPayment(@RequestBody PaymentRequestDTO paymentRequest) {
        try {
            Payment payment = paymentService.processPayment(paymentRequest);
            return ResponseEntity.ok(Map.of(
                    "status", payment.getStatus(),
                    "status_detail", payment.getStatusDetail(),
                    "id", payment.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/preference")
    public ResponseEntity<Map<String, String>> createPreference(@PathVariable Long id) {
        String preferenceId = paymentService.createPreference(id);
        return ResponseEntity.ok(Map.of("preferenceId", preferenceId));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String statusStr = payload.get("status");
        try {
            OrderStatus newStatus = OrderStatus.valueOf(statusStr.toUpperCase());
            return ResponseEntity.ok(orderService.updateOrderStatus(id, newStatus));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado inválido.");
        }
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders() {
        return ResponseEntity.ok(orderService.getUserOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // ✨ WEBHOOK: MercadoPago llama a esta URL cuando hay novedades
    @PostMapping("/webhook")
    public ResponseEntity<String> receiveWebhook(@RequestParam Map<String, String> params) {
        System.out.println("🔔 WEBHOOK RECIBIDO: " + params);

        // 1. Detectar si es un aviso de pago
        // MP suele mandar: ?type=payment&data.id=... O ?topic=payment&id=...
        String type = params.get("type");
        String topic = params.get("topic");
        String idStr = params.get("data.id");
        
        if (idStr == null) {
            idStr = params.get("id"); // Fallback para topic=payment
        }

        // 2. Si es un pago, verificamos el estado real en MP
        if ("payment".equals(type) || "payment".equals(topic)) {
            if (idStr != null) {
                try {
                    Long paymentId = Long.parseLong(idStr);
                    
                    // Consultamos a MP (Fuente de verdad)
                    Payment payment = paymentService.getPaymentById(paymentId);
                    
                    // Verificamos que esté aprobado
                    if ("approved".equals(payment.getStatus())) {
                        // El externalReference es nuestro Order ID
                        String externalRef = payment.getExternalReference();
                        Long orderId = Long.parseLong(externalRef);
                        
                        // Actualizamos la orden en nuestro sistema
                        orderService.approveOrderPayment(orderId);
                        
                        System.out.println("✅ ORDEN #" + orderId + " PAGADA EXITOSAMENTE");
                    }
                } catch (Exception e) {
                    System.err.println("❌ Error procesando webhook: " + e.getMessage());
                    // Aun si fallamos nosotros, devolvemos 200 a MP para que no reintente infinitamente
                    // (O devuelve 500 si prefieres que reintente luego)
                }
            }
        }

        return ResponseEntity.ok("Recibido");
    }
}