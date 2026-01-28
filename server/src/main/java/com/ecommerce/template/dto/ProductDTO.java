package com.ecommerce.template.dto;

import jakarta.validation.constraints.*; // Importante para las validaciones
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductDTO {
    private Long id;

    @NotBlank(message = "El nombre del producto es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String name;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a 0")
    private BigDecimal price;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    private String categoryName;

    @NotNull(message = "Debes seleccionar una categoría")
    private Long categoryId;

    private String imageUrl;

    @Size(max = 2000, message = "La descripción es demasiado larga (máx 2000 caracteres)")
    private String description;

    private Boolean active;

    // Constructor vacío
    public ProductDTO() {}

    // Constructor completo
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