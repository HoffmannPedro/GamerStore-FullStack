package com.ecommerce.template.repository;

import com.ecommerce.template.model.Order;
import com.ecommerce.template.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Buscar todas las órdenes de un usuario específico (para el historial)
    List<Order> findByUser(User user);
    
    // Ordenar por fecha descendente (las más nuevas primero)
    List<Order> findByUserOrderByDateDesc(User user);
}