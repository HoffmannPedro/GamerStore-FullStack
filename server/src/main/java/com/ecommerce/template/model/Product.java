package com.ecommerce.template.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter

@Entity
@Table(name = "products")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "stock", nullable = false)
    private Integer stock;

    // Relación N:1 con Category
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(columnDefinition = "TEXT") // Permite textos largos
    private String description;

    @Column(name = "is_active", nullable = false)
    private Boolean active = true;

    // Constructor vacío para JPA
    public Product() {}

    // Constructor con campos 
    public Product(String name, BigDecimal price, Integer stock, Category category, String imageUrl, String description, Boolean active) {
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.imageUrl = imageUrl;
        this.description = description;
        this.active = active;
    }
}
