package com.ecommerce.template.service;

import com.ecommerce.template.dto.ProductDTO;
import com.ecommerce.template.model.Category;
import com.ecommerce.template.model.Product;
import com.ecommerce.template.repository.CategoryRepository;
import com.ecommerce.template.repository.ProductRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<ProductDTO> getAllProducts( String name, Long categoryId, Boolean inStock, String sortOrder) {
        logger.info("Obteniendo todos los productos, total: {}", productRepository.findAll().size());

        // Configura el Stock mínimo (Si inStock es true, pedimos stock >= 1, sino null para ignorar)
        Integer minStock = (inStock != null && inStock) ? 1 : null;

        String searchPattern = (name != null && !name.isEmpty())
                ? "%" + name.toLowerCase() + "%"
                : null;

        // Configura el Ordenamiento (Sort)
        Sort sort = Sort.unsorted();
        if (sortOrder != null) {
            switch (sortOrder) {
                case "price_asc": sort = Sort.by("price").ascending(); break;
                case "price_desc": sort = Sort.by("price").descending(); break;
                case "alpha_asc": sort = Sort.by("name").ascending(); break;
                case "alpha_desc": sort = Sort.by("name").descending(); break;
            }
        }

        // Llama al Repositorio Inteligente
        List<Product> products = productRepository.findWithFilters(searchPattern, categoryId, minStock, sort);

        return products.stream()
                .map(product -> new ProductDTO(
                        product.getId(),
                        product.getName(),
                        product.getPrice(),
                        product.getStock(),
                        product.getCategory() != null ? product.getCategory().getName() : "Sin categoría",
                        product.getCategory() != null ? product.getCategory().getId() : null,
                        product.getImageUrl()
                ))
                .collect(Collectors.toList());
    }

    public ProductDTO createProduct(ProductDTO productDTO) {
        try {
            logger.info("Creando producto: {}", productDTO.getName());
            Category category = null;
            if (productDTO.getCategoryId() != null) {
                category = categoryRepository.findById(productDTO.getCategoryId())
                        .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada: " + productDTO.getCategoryId()));
            }
            Product product = new Product(
                    productDTO.getName(),
                    productDTO.getPrice(),
                    productDTO.getStock(),
                    category,
                    productDTO.getImageUrl()
            );
            product = productRepository.save(product);
            logger.info("Producto creado con ID: {}", product.getId());
            return new ProductDTO(
                    product.getId(),
                    product.getName(),
                    product.getPrice(),
                    product.getStock(),
                    product.getCategory() != null ? product.getCategory().getName() : "Sin categoría",
                    product.getCategory() != null ? product.getCategory().getId() : null,
                    product.getImageUrl()
            );
        } catch (Exception e) {
            logger.error("Error al crear producto: {}", e.getMessage());
            throw new RuntimeException("Error al crear producto: " + e.getMessage());
        }
    }

    public void deleteProduct(Long id) {
        try {
            logger.info("Eliminando productos con id {}", id);
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado" + id));
            productRepository.delete(product);
            logger.info("Producto eliminado con id {}", id);
        } catch (RuntimeException e) {
            logger.error("Error al eliminar producto: {}", e.getMessage());
            throw new RuntimeException("Error al eliminar producto: " + e.getMessage());
        }
    }
}