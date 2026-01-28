package com.ecommerce.template.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")  // Para todas las rutas
                    .allowedOrigins("http://localhost:5173")  // Origen del frontend
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Verbos permitidos
                    .allowedHeaders("*")  // Headers
                    .allowCredentials(true);  // Cookies si se necesita
            }
        };
    }
}