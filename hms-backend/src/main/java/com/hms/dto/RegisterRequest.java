package com.hms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * DTO for user registration requests.
 * Contains base fields for all users plus optional role-specific fields.
 */
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String phone;

    @NotBlank(message = "Role is required")
    private String role; // "PATIENT" or "DOCTOR"

    // Patient-specific fields
    private Integer age;
    private String gender;
    private String bloodGroup;
    private String address;
    private String emergencyContact;

    // Doctor-specific fields
    private String specialization;
    private String qualification;
    private Integer experienceYears;
    private Double consultationFee;
    private String bio;
}
