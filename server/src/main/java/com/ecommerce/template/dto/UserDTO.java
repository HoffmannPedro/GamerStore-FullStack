package com.ecommerce.template.dto;

import com.ecommerce.template.model.AuthProvider;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class UserDTO {
    private Long id;
    private String username;
    private String role;
    private AuthProvider provider;
    private String profilePictureUrl;

    public UserDTO( Long id, String username, String role, AuthProvider provider, String profilePictureUrl) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.provider = provider;
        this.profilePictureUrl = profilePictureUrl;
    }
}