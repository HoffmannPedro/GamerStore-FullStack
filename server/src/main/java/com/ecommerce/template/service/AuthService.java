package com.ecommerce.template.service;

import com.ecommerce.template.model.AuthProvider;
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

    public String register(String email, String password) {
        logger.info("👤 [AUTH] Intentando registrar nuevo usuario: '{}'", email);

        if (userRepository.findByEmail(email).isPresent()) {
            logger.warn("❌ [AUTH] Fallo registro: El usuario '{}' ya existe", email);
            throw new RuntimeException("El usuario ya existe: " + email);
        }
        User user = new User();
        user.setEmail(email);
        user.setUsername(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("USER"); // Asigna rol por defecto.
        user.setProvider(AuthProvider.LOCAL);

        userRepository.save(user);
        logger.info("✅ [AUTH] Usuario registrado con éxito: '{}' (ID: {})", email, user.getId());

        return jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getProfilePictureUrl());
    }

    public String login(String email, String password) {
        logger.info("🔐 [AUTH] Login solicitado para email: '{}'", email);

        try {
            // Esto usa el userDetailsService que configuramos para buscar por email
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password));

            // Buscamos el usuario completo para generar el token
            User user = userRepository.findByEmail(email).orElseThrow();

            logger.info("✅ [AUTH] Login exitoso: {}", user.getUsername());
            return jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getProfilePictureUrl());
        } catch (Exception e) {
            logger.error("❌ [AUTH] Credenciales inválidas para: {}", email);
            throw e;
        }
    }
}