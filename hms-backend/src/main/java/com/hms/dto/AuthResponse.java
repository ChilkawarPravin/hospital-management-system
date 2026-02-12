package com.hms.dto;

import lombok.*;

/**
 * DTO for authentication response containing JWT token and user info.
 */
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long userId;
    private String name;
    private String email;
    private String role;
}
