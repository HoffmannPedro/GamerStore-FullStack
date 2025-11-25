package com.ecommerce.template.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class CartItemDTO {

    private Long id;
    private Long productId;
    private String productName;
    private double price;
    private Integer stock;
    private Integer quantity;
    private String imageUrl;

    public CartItemDTO() {}

    public CartItemDTO(Long id, Long productId, String productName, double price, Integer stock, Integer quantity, String imageUrl) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.stock = stock;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
    }
}