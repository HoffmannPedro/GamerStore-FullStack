package com.ecommerce.template.model;

public enum OrderStatus {
    PENDIENTE,  // Recién creada, aún no pagada/confirmada
    PAGADO,     // Ya tenemos la plata (o el comprobante)
    ENVIADO,    // Ya salió para la casa del cliente
    ENTREGADO,  // Finalizado
    CANCELADO   // Algo salió mal
}