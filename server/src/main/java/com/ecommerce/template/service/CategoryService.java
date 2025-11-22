package com.ecommerce.template.service;

import com.ecommerce.template.dto.CategoryDTO;
import com.ecommerce.template.dto.ProductDTO;
import com.ecommerce.template.model.Category;
import com.ecommerce.template.model.Product;
import com.ecommerce.template.repository.CategoryRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);

    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryDTO> getAllCategories() {
        logger.info("📂 [CATEGORIAS] Obteniendo todas las categorías");
        return categoryRepository.findAll().stream()
                .map(category -> new CategoryDTO(
                        category.getId(),
                        category.getName(),
                        category.getProducts().stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        try {
            logger.info("✨ [CATEGORIAS] Creando nueva categoría: '{}'", categoryDTO.getName());
            Category category = new Category(categoryDTO.getName());
            category = categoryRepository.save(category);

            logger.info("✨ [CATEGORIAS] Categoría {} creada con ID: {}", categoryDTO.getName(), category.getId());
            return new CategoryDTO(category.getId(), category.getName(), new ArrayList<>());
        } catch (Exception e) {
            logger.error("❌ [CATEGORIAS] Error al crear categoría: {}", e.getMessage());
            throw new RuntimeException("Error al crear categoría: " + e.getMessage());
        }
    }

    public void deleteCategory(Long id) {
        try {
            logger.info("🗑️ [CATEGORIAS] Intentando borrar ID: {}", id);
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Categoría con id:" + id + " no encontrada" ));
            if (!category.getProducts().isEmpty()) {
                logger.warn("⚠️ [CATEGORIAS] No se puede borrar: tiene productos asociados.");
                throw new IllegalArgumentException("No se puede eliminar una categoría que tiene productos asociados");
            }
            categoryRepository.delete(category);
            logger.info("🗑️ [CATEGORIAS] Categoría {} eliminada con ID: {}", category.getName(), id);
        } catch (RuntimeException e) {
            logger.error("❌ [CATEGORIAS] Error al eliminar categoría: {}", e.getMessage());
            throw new RuntimeException("Error al eliminar categoría: " + e.getMessage());
        }
    }

    private ProductDTO convertToDTO(Product product) {
        return new ProductDTO(
                        product.getId(),
                        product.getName(),
                        product.getPrice(),
                        product.getStock(),
                        product.getCategory() != null ? product.getCategory().getName() : "Sin categoría",
                        product.getCategory() != null ? product.getCategory().getId() : null,
                        product.getImageUrl(),
                        product.getDescription(),
                        product.getActive());
    }
}