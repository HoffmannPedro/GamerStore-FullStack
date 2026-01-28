package com.ecommerce.template.controller;

import com.ecommerce.template.dto.ProductDTO;
import com.ecommerce.template.service.ProductService;
import jakarta.validation.Valid; // Necesario para activar las validaciones del DTO
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor // Inyección por constructor automática (Lombok)
public class ProductController {

    private final ProductService productService; // 'final' es clave aquí

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String sortOrder
    ) {
        return ResponseEntity.ok(productService.getAllProducts(name, categoryId, inStock, active, sortOrder));
    }

    @PostMapping
    // @Valid disparará errores si el DTO no cumple las reglas (ej: precio negativo)
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.createProduct(productDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.updateProduct(id, productDTO));
    }
}