package com.ecommerce.template.service;

import com.ecommerce.template.dto.CartDTO;
import com.ecommerce.template.dto.CartItemDTO;
import com.ecommerce.template.model.Cart;
import com.ecommerce.template.model.CartItem;
import com.ecommerce.template.model.Product;
import com.ecommerce.template.model.User;
import com.ecommerce.template.repository.CartRepository;
import com.ecommerce.template.repository.CartItemRepository;
import com.ecommerce.template.repository.ProductRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    private static final Logger logger = LoggerFactory.getLogger(CartService.class);

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    // OBTENER CARRITO
    public CartDTO getCart() {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    logger.info("🛒 [CARRITO] Primer acceso. Creando carrito nuevo para usuario: '{}'",
                            user.getUsername());
                    return cartRepository.save(new Cart(user));
                });
        return convertToDTO(cart);
    }

    // AGREGAR ITEM
    public CartDTO addItem(Long productId, Integer quantity) {

        User user = getCurrentUser();
        Cart cart = cartRepository.findByUser(user).orElseGet(() -> cartRepository.save(new Cart(user)));
        Product product = productRepository.findById(productId).orElseThrow();

        logger.info("🛒 [CARRITO] Usuario '{}' quiere agregar '{}' (x{})", user.getUsername(), product.getName(),
                quantity);

        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        int currentQuantityInCart = (existingItem != null) ? existingItem.getQuantity() : 0;

        // VALIDACIÓN STOCK
        if (currentQuantityInCart + quantity > product.getStock()) {
            logger.warn("🚫 [STOCK] Intento fallido. Usuario pidió {} (tiene {}), Stock real: {}",
                    quantity, currentQuantityInCart, product.getStock());
            throw new RuntimeException("Stock insuficiente. Disponibles: " + product.getStock());
        }

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
            logger.info("🔄 [CARRITO] Cantidad actualizada. Ahora tiene {} unidades.", existingItem.getQuantity());
        } else {
            CartItem newItem = new CartItem(product, quantity, cart);
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
            logger.info("➕ [CARRITO] Producto nuevo añadido exitosamente.");
        }

        return convertToDTO(cartRepository.save(cart));
    }

    // REMOVER UNA UNIDAD
    public CartDTO removeOne(Long productId) {

        User user = getCurrentUser();
        Cart cart = cartRepository.findByUser(user).orElseThrow();

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst().orElseThrow();

        if (item.getQuantity() > 1) {
            item.setQuantity(item.getQuantity() - 1);
            cartItemRepository.save(item);
            logger.info("➖ [CARRITO] Restada 1 unidad de '{}'. Quedan: {}", item.getProduct().getName(), item.getQuantity());
        } else {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
            logger.info("🗑️ [CARRITO] Última unidad removida. Producto '{}' eliminado del carro.", item.getProduct().getName());
        }

        return convertToDTO(cartRepository.save(cart));
    }

    // REMOVER ITEM COMPLETO
    public CartDTO removeItem(Long productId) {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUser(user).orElseThrow();

        boolean removed = cart.getItems().removeIf(item -> {
            if (item.getProduct().getId().equals(productId)) {
                logger.info("🗑️ [CARRITO] Eliminando TODAS las unidades de '{}'", item.getProduct().getName());
                cartItemRepository.delete(item); // Borrado físico
                return true;
            }
            return false;
        });

        return convertToDTO(cartRepository.save(cart));
    }

    // LIMPIAR CARRITO
    public CartDTO clearCart() {

        User user = getCurrentUser();
        logger.info("🧹 [CARRITO] Solicitud de vaciado completo por usuario: '{}'", user.getUsername());

        Cart cart = cartRepository.findByUser(user).orElseThrow();

        // Borra todos los items (gracias a orphanRemoval = true)
        cart.getItems().clear();

        return convertToDTO(cartRepository.save(cart));

    }

    // Helper para no repetir código de conversión
    private CartDTO convertToDTO(Cart cart) {
        return new CartDTO(
                cart.getId(),
                cart.getUser().getId(),
                cart.getItems().stream().map(i -> new CartItemDTO(
                        i.getId(),
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getProduct().getPrice().doubleValue(),
                        i.getProduct().getStock(),
                        i.getQuantity(),
                        i.getProduct().getImageUrl())).collect(Collectors.toList()));
    }

}