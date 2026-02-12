package com.hms.service;

import com.hms.dto.*;
import com.hms.entity.*;
import com.hms.entity.enums.Gender;
import com.hms.entity.enums.Role;
import com.hms.exception.BadRequestException;
import com.hms.repository.*;
import com.hms.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Authentication Service - handles user registration and login.
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenProvider tokenProvider;

    /**
     * Register a new user (patient or doctor).
     * Creates both the User record and the role-specific profile.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // Create user entity
        Role role = Role.valueOf(request.getRole().toUpperCase());
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(role)
                .build();

        user = userRepository.save(user);

        // Create role-specific profile
        if (role == Role.PATIENT) {
            Patient patient = Patient.builder()
                    .user(user)
                    .age(request.getAge())
                    .gender(request.getGender() != null ?
                            Gender.valueOf(request.getGender().toUpperCase()) : null)
                    .bloodGroup(request.getBloodGroup())
                    .address(request.getAddress())
                    .emergencyContact(request.getEmergencyContact())
                    .build();
            patientRepository.save(patient);
        } else if (role == Role.DOCTOR) {
            Doctor doctor = Doctor.builder()
                    .user(user)
                    .specialization(request.getSpecialization())
                    .qualification(request.getQualification())
                    .experienceYears(request.getExperienceYears())
                    .consultationFee(request.getConsultationFee())
                    .bio(request.getBio())
                    .available(true)
                    .build();
            doctorRepository.save(doctor);
        }

        // Generate JWT token
        String token = tokenProvider.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    /**
     * Authenticate user and return JWT token.
     */
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        String token = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
