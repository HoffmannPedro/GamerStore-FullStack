package com.ecommerce.template.repository;

import com.ecommerce.template.model.Product;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

        // CAMBIO CLAVE: Quitamos LOWER() alrededor de :name
        // Ahora comparamos: LOWER(columna) LIKE :name (que ya vendrá en minúsculas
        // desde Java)
        @Query("SELECT p FROM Product p WHERE " +
                        "(:name IS NULL OR LOWER(p.name) LIKE :name) AND " +
                        "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
                        "(:minStock IS NULL OR p.stock >= :minStock) AND " +
                        "(:active IS NULL OR p.active = :active)")
        List<Product> findWithFilters(
                        @Param("name") String name,
                        @Param("categoryId") Long categoryId,
                        @Param("minStock") Integer minStock,
                        @Param("active") Boolean active,
                        Sort sort);
}