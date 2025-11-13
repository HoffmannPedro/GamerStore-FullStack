package com.ecommerce.template.dto;

import java.util.ArrayList;
import java.util.List;

public class CartDTO {

    private Long id;
    private Long userId; // Placeholder hasta auth
    private List<CartItemDTO> items;

    public CartDTO() {
        this.items = new ArrayList<>();
    }

    public CartDTO(Long id, Long userId, List<CartItemDTO> items) {
        this.id = id;
        this.userId = userId;
        this.items = items != null ? items : new ArrayList<>();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<CartItemDTO> getItems() { return items; }
    public void setItems(List<CartItemDTO> items) { this.items = items; }
}