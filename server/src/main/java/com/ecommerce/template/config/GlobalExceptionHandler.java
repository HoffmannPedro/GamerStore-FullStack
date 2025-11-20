package com.ecommerce.template.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Atrapa errores de "No encontrado" o argumentos inválidos (ej: ID incorrecto, Stock insuficiente)
    @ExceptionHandler({IllegalArgumentException.class, RuntimeException.class})
    public ResponseEntity<Map<String, String>> handleLogicErrors(Exception ex) {
        logger.warn("⚠️ [ERROR LÓGICO]: {}", ex.getMessage());
        
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getMessage());
        errorResponse.put("status", "error");

        // Devolvemos 400 Bad Request en lugar de 500 o 403
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    // Atrapa errores inesperados (NullPointer, etc)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralErrors(Exception ex) {
        logger.error("❌ [ERROR CRÍTICO]: {}", ex.getMessage(), ex);
        
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Ocurrió un error interno en el servidor.");
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}