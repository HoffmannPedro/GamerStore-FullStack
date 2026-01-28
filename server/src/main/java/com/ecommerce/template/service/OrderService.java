package com.ecommerce.template.service;

import com.ecommerce.template.dto.PaymentRequestDTO;
import com.ecommerce.template.model.*;
import com.ecommerce.template.repository.CartRepository;
import com.ecommerce.template.repository.OrderRepository;
import com.ecommerce.template.repository.ProductRepository;
import com.ecommerce.template.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // Helper para obtener usuario actual
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional // IMPORTANTE: Si algo falla (ej: sin stock), se deshacen todos los cambios
    public Order createOrder(PaymentRequestDTO request, String userEmail) {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("El carrito no existe"));

        List<CartItem> cartItems = cart.getItems();

        if (cartItems.isEmpty()) {
            throw new RuntimeException("El carrito está vacío, no se puede crear orden.");
        }

        // 1. Calcular total y Validar Stock
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : cartItems) {
            Product product = item.getProduct();

            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Stock insuficiente para: " + product.getName());
            }

            // Restar stock
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);

            // Sumar al total
            BigDecimal itemTotal = product.getPrice().multiply(new BigDecimal(item.getQuantity()));
            total = total.add(itemTotal);
        }

        // 2. Crear la Orden
        Order order = new Order(user, total, OrderStatus.PENDIENTE);

        // 3. Convertir CartItems a OrderItems (Snapshot de precio)
        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> {
            return new OrderItem(
                    order,
                    cartItem.getProduct(),
                    cartItem.getQuantity(),
                    cartItem.getProduct().getPrice() // Guardamos el precio ACTUAL
            );
        }).toList();

        order.setDeliveryMethod(request.getDeliveryMethod());
        order.setShippingAddress(request.getShippingAddress());

        order.setItems(orderItems);
        Order savedOrder = orderRepository.save(order);

        // 4. Vaciar el Carrito (Borrado físico de items)
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        User currentUser = getCurrentUser();

        // VALIDACIÓN DE SEGURIDAD Y PROPIEDAD
        // Si NO es admin Y el usuario de la orden no es el usuario actual... ERROR.
        if (!"ADMIN".equals(currentUser.getRole()) && !order.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("No tienes permiso para modificar esta orden.");
        }

        // VALIDACIÓN DE REGLAS DE NEGOCIO PARA USUARIOS NORMALES
        // Si es usuario normal, SOLO puede pasar a CANCELADO y solo si estaba PENDIENTE
        if (!"ADMIN".equals(currentUser.getRole())) {
            if (newStatus != OrderStatus.CANCELADO) {
                throw new RuntimeException("No tienes permisos para cambiar el estado a " + newStatus);
            }
            if (order.getStatus() != OrderStatus.PENDIENTE) {
                throw new RuntimeException("No se puede cancelar una orden que ya no está pendiente.");
            }
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    // Y ya que estamos, un método para ver TODAS las órdenes (para el Admin)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getUserOrders() {
        User user = getCurrentUser(); // Ya tenías este helper
        // Buscamos las órdenes de este usuario
        return orderRepository.findByUser(user);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
    }

    // ✨ NUEVO MÉTODO: Para uso exclusivo del Webhook (Sistema)
    // No chequea usuario logueado porque lo llama MercadoPago
    @Transactional
    public void approveOrderPayment(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada: " + orderId));
        
        if (order.getStatus() == OrderStatus.PENDIENTE) {
            order.setStatus(OrderStatus.PAGADO);
            orderRepository.save(order);
            // Aquí podrías agregar lógica extra: enviar email, descontar stock si no se hizo antes, etc.
        }
    }
}