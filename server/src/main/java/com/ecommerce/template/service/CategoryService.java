package com.ecommerce.template.service;

import com.ecommerce.template.dto.CategoryDTO;
import com.ecommerce.template.dto.ProductDTO;
import com.ecommerce.template.model.Category;
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
        logger.info("Obteniendo todas las categorías");
        return categoryRepository.findAll().stream()
                .map(category -> new CategoryDTO(
                        category.getId(),
                        category.getName(),
                        category.getProducts().stream()
                                .map(product -> new ProductDTO(
                                        product.getId(),
                                        product.getName(),
                                        product.getPrice(),
                                        product.getStock(),
                                        category.getName(),
                                        category.getId(),
                                        product.getImageUrl(),
                                        product.getDescription()
                                ))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        try {
            logger.info("Creando categoría: {}", categoryDTO.getName());
            Category category = new Category(categoryDTO.getName());
            category = categoryRepository.save(category);

            logger.info("Categoría {} creada con ID: {}", categoryDTO.getName(), category.getId());
            return new CategoryDTO(category.getId(), category.getName(), new ArrayList<>());
        } catch (Exception e) {
            logger.error("Error al crear categoría: {}", e.getMessage());
            throw new RuntimeException("Error al crear categoría: " + e.getMessage());
        }
    }

    public void deleteCategory(Long id) {
        try {
            logger.info("Eliminando categoría con ID: {}", id);
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Categoría con id:" + id + " no encontrada" ));
            if (!category.getProducts().isEmpty()) {
                logger.warn("Intento de eliminar categoría con productos {}", id);
                throw new IllegalArgumentException("No se puede eliminar una categoría que tiene productos asociados");
            }
            categoryRepository.delete(category);
            logger.info("Categoría {} eliminada con ID: {}", category.getName(), id);
        } catch (RuntimeException e) {
            logger.error("Error al eliminar categoría: {}", e.getMessage());
            throw new RuntimeException("Error al eliminar categoría: " + e.getMessage());
        }
    }
}