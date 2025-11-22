package com.ecommerce.template.dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ProductDTO {
    private Long id;
    private String name;
    private BigDecimal price;
    private Integer stock;
    private String categoryName;
    private Long categoryId;
    private String imageUrl;
    private String description;
    private Boolean active;

    public ProductDTO() {}
    public ProductDTO(
        Long id, 
        String name, 
        BigDecimal price, 
        Integer stock, 
        String categoryName, 
        Long categoryId, 
        String imageUrl, 
        String description, 
        Boolean active
    ) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.categoryName = categoryName;
        this.categoryId = categoryId;
        this.imageUrl = imageUrl;
        this.description = description;
        this.active = active;
    }
}