package com.ecommerce.template.repository;

import com.ecommerce.template.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {}