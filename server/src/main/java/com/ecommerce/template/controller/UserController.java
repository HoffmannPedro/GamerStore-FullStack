package com.ecommerce.template.controller;

import com.ecommerce.template.dto.UserDTO;
import com.ecommerce.template.model.AuthProvider;
import com.ecommerce.template.model.User;
import com.ecommerce.template.repository.UserRepository;
import com.ecommerce.template.security.JwtUtil;
import com.ecommerce.template.service.ImageService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ImageService imageService;

    // Helper
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentProfile() {
        User user = getCurrentUser();
        
        return ResponseEntity.ok(new UserDTO(
            user.getId(),
            user.getUsername(),
            user.getRole(),
            user.getProvider(),
            user.getProfilePictureUrl()
        ));
    }

    // Cambiar nombre de usuario
    @PutMapping("/me")
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody Map<String, String> payload) {
        User user = getCurrentUser();
        String newUsername = payload.get("username");
        
        if (newUsername != null && !newUsername.isBlank()) {
            if (userRepository.findByUsername(newUsername).isPresent() && !user.getUsername().equals(newUsername)) {
                throw new RuntimeException("El nombre de usuario ya está en uso");
            }
            user.setUsername(newUsername);
            userRepository.save(user);
        }
        
        // GENERAR NUEVO TOKEN CON EL NUEVO NOMBRE
        String newToken = jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getProfilePictureUrl());

        // Devolvemos el usuario actualizado Y el nuevo token
        return ResponseEntity.ok(Map.of(
            "user", new UserDTO(user.getId(), user.getUsername(), user.getRole(), user.getProvider(), user.getProfilePictureUrl()),
            "token", newToken
        ));
    }

    // Cambiar foto de perfil
    @PostMapping("/me/picture")
    public ResponseEntity<UserDTO> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        User user = getCurrentUser();

        String imageUrl = imageService.uploadImage(file);

        user.setProfilePictureUrl(imageUrl);
        userRepository.save(user);

        return ResponseEntity.ok(new UserDTO(
            user.getId(),
            user.getUsername(),
            user.getRole(),
            user.getProvider(),
            user.getProfilePictureUrl()
        ));
    }

    // Cambiar password
    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> payload) {
        User user = getCurrentUser();

        if (user.getProvider() == AuthProvider.GOOGLE) {
            throw new RuntimeException("Los usuarios de Google no pueden cambiar contraseña aquí.");
        }

        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Contraseña actualizada correctamente"));
    }
}