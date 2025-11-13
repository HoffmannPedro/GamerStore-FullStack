package com.ecommerce.template.controller;

import com.ecommerce.template.dto.CartDTO;
import com.ecommerce.template.dto.CartItemDTO;
import com.ecommerce.template.service.CartService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<CartDTO> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    @PostMapping("/items")
    public ResponseEntity<CartDTO> addItem(@RequestBody CartItemDTO itemDTO) {
        return ResponseEntity.ok(cartService.addItem(itemDTO.getProductId(), itemDTO.getQuantity()));
    }

    @DeleteMapping("/items/{productId}/one")
    public ResponseEntity<CartDTO> removeOne(@PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeOne(productId));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartDTO> removeItem(@PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeItem(productId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<CartDTO> clearCart() {
        return ResponseEntity.ok(cartService.clearCart());
    }
}