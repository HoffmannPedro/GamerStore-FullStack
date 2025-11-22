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

    // OBTENER PRODUCTOS (CON FILTROS)
    public List<ProductDTO> getAllProducts(String name, Long categoryId, Boolean inStock, Boolean active, String sortOrder) {
        logger.info("🔍 [PRODUCTOS] Buscando... Filtros -> Nombre: '{}', CatID: {}, EnStock: {}, Orden: '{}'",
                name != null ? name : "Todos",
                categoryId != null ? categoryId : "Todas",
                inStock,
                sortOrder);

        // Configura el Stock mínimo (Si inStock es true, pedimos stock >= 1, sino null
        // para ignorar)
        Integer minStock = (inStock != null && inStock) ? 1 : null;

        String searchPattern = (name != null && !name.isEmpty())
                ? "%" + name.toLowerCase() + "%"
                : null;

        // Configura el Ordenamiento (Sort)
        Sort sort = Sort.unsorted();
        if (sortOrder != null) {
            switch (sortOrder) {
                case "price_asc":
                    sort = Sort.by("price").ascending();
                    break;
                case "price_desc":
                    sort = Sort.by("price").descending();
                    break;
                case "alpha_asc":
                    sort = Sort.by("name").ascending();
                    break;
                case "alpha_desc":
                    sort = Sort.by("name").descending();
                    break;
            }
        }

        // Llama al Repositorio Inteligente
        List<Product> products = productRepository.findWithFilters(searchPattern, categoryId, minStock, active, sort);
        logger.info("📦 [PRODUCTOS] Se encontraron {} resultados.", products.size());

        return products.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // CREAR PRODUCTO
    public ProductDTO createProduct(ProductDTO productDTO) {
        try {
            logger.info("✨ [PRODUCTOS] Creando nuevo item: '{}' (${})", productDTO.getName(), productDTO.getPrice());

            Category category = null;
            if (productDTO.getCategoryId() != null) {
                category = categoryRepository.findById(productDTO.getCategoryId())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Categoría no encontrada: " + productDTO.getCategoryId()));
            }
            Product product = new Product(
                    productDTO.getName(),
                    productDTO.getPrice(),
                    productDTO.getStock(),
                    category,
                    productDTO.getImageUrl(),
                    productDTO.getDescription(),
                    true);
            product = productRepository.save(product);
            logger.info("✅ [PRODUCTOS] Creado exitosamente con ID: {}", product.getId());

            return convertToDTO(product);
        } catch (Exception e) {
            logger.error("❌ [PRODUCTOS] Error creando: {}", e.getMessage());
            throw new RuntimeException("Error al crear producto: " + e.getMessage());
        }
    }

    // BORRAR PRODUCTO
    public void deleteProduct(Long id) {
        try {
            logger.info("🗑️ [PRODUCTOS] Solicitud para eliminar ID: {}", id);

            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado" + id));
            productRepository.delete(product);
            logger.info("✅ [PRODUCTOS] Eliminado correctamente ID: {}", id);
        } catch (RuntimeException e) {
            logger.warn("⚠️ [PRODUCTOS] No se pudo eliminar: ID {} no existe", id);
            throw new RuntimeException("Error al eliminar producto: " + e.getMessage());
        }
    }

    // ACTUALIZAR PRODUCTO
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        logger.info("✏️ [PRODUCTOS] Editando ID: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID " + id));

        if (productDTO.getName() != null) product.setName(productDTO.getName());
        if (productDTO.getPrice() != null) product.setPrice(productDTO.getPrice());
        if (productDTO.getImageUrl() != null) product.setImageUrl(productDTO.getImageUrl());
        if (productDTO.getStock() != null) product.setStock(productDTO.getStock());
        if (productDTO.getDescription() != null) product.setDescription(productDTO.getDescription());

        // --- ACTUALIZAR ESTADO (SOFT DELETE) ---
        if (productDTO.getActive() != null) {
            product.setActive(productDTO.getActive());
            logger.info("Producto ID {} estado cambiado a: {}", id, product.getActive());
        }

        // Si cambian la categoría
        if (productDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
            product.setCategory(category);
        }

        Product updatedProduct = productRepository.save(product);

        logger.info("✅ [PRODUCTOS] Actualización guardada para ID: {}", id);
        return convertToDTO(updatedProduct);
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