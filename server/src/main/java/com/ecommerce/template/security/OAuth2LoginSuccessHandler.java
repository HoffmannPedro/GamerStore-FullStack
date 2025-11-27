package com.ecommerce.template.security;

import com.ecommerce.template.model.User;
import com.ecommerce.template.model.AuthProvider; // Asegúrate de importar el Enum
import com.ecommerce.template.repository.UserRepository;
import com.ecommerce.template.service.CartService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CartService cartService; // Para crear carrito si es usuario nuevo

    // Esta URL debe ser la de tu Frontend (React)
    // En producción cambiará, así que mejor usar una variable o hardcodear la de Railway si prefieres
    @Value("${frontend.url:http://localhost:5173}") 
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        // Extraemos datos de Google
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name"); // O "login" si prefieres

        // Buscamos o Creamos el usuario
        User user = userRepository.findByUsername(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUsername(email);
                    newUser.setRole("USER");
                    newUser.setProvider(AuthProvider.GOOGLE);
                    newUser.setPassword(null); // Sin password
                    return userRepository.save(newUser);
                });

        // Generamos el Token JWT
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        // Redirigimos al Frontend con el token en la URL
        getRedirectStrategy().sendRedirect(request, response, frontendUrl + "/oauth/callback?token=" + token + "&username=" + email);
    }
}