package com.ecommerce.template.service;

import com.ecommerce.template.model.User;
import com.ecommerce.template.repository.UserRepository;
import com.ecommerce.template.security.JwtUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public String register(String username, String password) {
        logger.info("👤 [AUTH] Intentando registrar nuevo usuario: '{}'", username);

        if (userRepository.findByUsername(username).isPresent()) {
            logger.warn("❌ [AUTH] Fallo registro: El usuario '{}' ya existe", username);
            throw new RuntimeException("El usuario ya existe: " + username);
        }
        User user = new User(username, passwordEncoder.encode(password));

        user.setRole("USER"); // Asigna rol por defecto.

        userRepository.save(user);
        logger.info("✅ [AUTH] Usuario registrado con éxito: '{}' (ID: {})", username, user.getId());
        return jwtUtil.generateToken(username, user.getRole());
    }

    public String login(String username, String password) {
        logger.info("🔐 [AUTH] Intento de inicio de sesión: '{}'", username);
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password));
            
            User user = userRepository.findByUsername(username).orElseThrow();
            logger.info("✅ [AUTH] Login exitoso para: '{}' (Rol: {})", username, user.getRole());
            
            return jwtUtil.generateToken(username, user.getRole());
        } catch (Exception e) {
            logger.error("❌ [AUTH] Fallo de login para '{}': Credenciales inválidas", username);
            throw e;
        }
    }
}