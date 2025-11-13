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

    public CartDTO getCart() {
        try {
            User user = getCurrentUser();
            System.out.println("AQUI");
            logger.info("Obteniendo carrito para el usuario: {}", user.getUsername());
            Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    logger.error("Carrito no encontrado, creando uno nuevo para el usuario: {}", user.getUsername());
                    Cart newCart = new Cart(user);
                    return cartRepository.save(newCart);
                });
            return new CartDTO(
                cart.getId(),
                cart.getUser().getId(),
                cart.getItems().stream().map(item -> new CartItemDTO (
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getPrice().doubleValue(),
                        item.getQuantity()
                )).collect(Collectors.toList())
            ); 
        } catch (Exception e) {
            logger.error("Error al obtener el carrito para el usuario: {}", e.getMessage());
            throw new RuntimeException("Error al obtener el carrito: " + e.getMessage());
        }               
    }

    public CartDTO addItem(Long productId, Integer quantity) {
        try {
            User user = getCurrentUser();
            logger.info("Agregando producto con ID: {} y cantidad: {} al carrito del usuario: {}", productId, quantity, user.getUsername());
            Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    logger.info("Carrito no encontrado, creando uno nuevo para el usuario: {}", user.getUsername());
                    return cartRepository.save(new Cart(user));
                }); 

            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Producto con ID: " + productId + " no encontrado"));
            
            CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);
            
            if (existingItem != null) {
                existingItem.setQuantity(existingItem.getQuantity() + quantity);
                cartItemRepository.save(existingItem);
                logger.info("Actualizada la cantidad del producto con ID: {} en carrito: {}", productId, cart.getId());
            } else {
                CartItem newItem = new CartItem(product, quantity, cart);
                cart.getItems().add(newItem);
                cartItemRepository.save(newItem);
                logger.info("Agregado nuevo producto con ID: {} al carrito: {}", productId, cart.getId());
            }

            cart = cartRepository.save(cart); // Persistir los cambios en el carrito
            return new CartDTO(
                cart.getId(),
                cart.getUser().getId(),
                cart.getItems().stream().map(item -> new CartItemDTO (
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getPrice().doubleValue(),
                        item.getQuantity()
                )).collect(Collectors.toList())
            );
        } catch (Exception e) {
            logger.error("Error al agregar el producto con ID: {} en el carrito:", productId, e.getMessage());
            throw new RuntimeException("Error al agregar el producto al carrito: " + e.getMessage());
        }
    }

    public CartDTO removeOne(Long productId) {
        try {
            User user = getCurrentUser();
            logger.info("Removiendo una unidad del producto con ID: {} del carrito del usuario: {}", productId, user.getUsername());
            Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Carrito no encontrado para usuario: " + user.getUsername()));

            CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Producto con ID: " + productId + " no encontrado en el carrito "));
            
            if (item.getQuantity() > 1) {
                item.setQuantity(item.getQuantity() - 1);
                cartItemRepository.save(item);
                logger.info("Disminuida la cantidad del producto con ID: {} en carrito: {}", productId, cart.getId());
            } else {
                cart.getItems().remove(item);
                cartItemRepository.delete(item);
                logger.info("Producto con ID: {} eliminado del carrito con ID: {}", productId, cart.getId());
            }

            cartRepository.save(cart); 
            return new CartDTO(
                cart.getId(),
                cart.getUser().getId(),
                cart.getItems().stream().map(i -> new CartItemDTO (
                        i.getId(),
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getProduct().getPrice().doubleValue(),
                        i.getQuantity()
                )).collect(Collectors.toList())
            );
        } catch (Exception e) {
            logger.error("Error al remover una unidad del producto con ID: {} en el carrito: {}", productId, e.getMessage());
            throw new RuntimeException("Error al eliminar una unidad del producto en el carrito: " + e.getMessage()); 
        }
    }

    public CartDTO removeItem(Long productId) {
        try {
            User user = getCurrentUser();
            logger.info("Removiendo el producto con ID: {} del carrito del usuario con userId: {}", productId, user.getUsername());
            Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Carrito no encontrado para usuario: " + user.getUsername()));
            
            CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Producto con ID: " + productId + " no encontrado en el carrito "));
            
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
            logger.info("Producto con ID: {} eliminado del carrito con ID: {}", productId, cart.getId());

            cartRepository.save(cart);
            return new CartDTO(
                cart.getId(),
                cart.getUser().getId(),
                cart.getItems().stream().map(i -> new CartItemDTO (
                        i.getId(),
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getProduct().getPrice().doubleValue(),
                        i.getQuantity()
                )).collect(Collectors.toList())
            );
        } catch (Exception e) {
            logger.error("Error al eliminar el producto con ID: {} del carrito: {}", productId, e.getMessage());
            throw new RuntimeException("Error al eliminar el producto del carrito: " + e.getMessage());
        }
    }

    // Limpiar carrito.
    public CartDTO clearCart() {
    try {
        User user = getCurrentUser();
        logger.info("Limpiando carrito del usuario: {}", user.getUsername());

        Cart cart = cartRepository.findByUser(user)
            .orElseThrow(() -> new IllegalArgumentException("Carrito no encontrado para usuario: " + user.getUsername()));

        // Borra todos los items (gracias a orphanRemoval = true)
        cart.getItems().clear();
        cartRepository.save(cart);

        logger.info("Carrito limpiado exitosamente para usuario: {}", user.getUsername());

        return new CartDTO(
            cart.getId(),
            cart.getUser().getId(),
            List.of() // lista vacía
        );
    } catch (Exception e) {
        logger.error("Error al limpiar el carrito: {}", e.getMessage());
        throw new RuntimeException("Error al limpiar el carrito: " + e.getMessage());
    }
}

}
