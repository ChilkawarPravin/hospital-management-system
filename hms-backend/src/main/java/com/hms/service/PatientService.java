package com.hms.service;

import com.hms.dto.PatientResponse;
import com.hms.entity.Patient;
import com.hms.entity.User;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.PatientRepository;
import com.hms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Patient Service - handles patient profile management.
 */
@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private UserRepository userRepository;

    /**
     * Get patient profile by email.
     */
    public PatientResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Patient patient = patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
        return mapToResponse(patient);
    }

    /**
     * Update patient profile.
     */
    public PatientResponse updateProfile(String email, PatientResponse request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Patient patient = patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAge() != null) patient.setAge(request.getAge());
        if (request.getGender() != null) {
            patient.setGender(com.hms.entity.enums.Gender.valueOf(request.getGender().toUpperCase()));
        }
        if (request.getBloodGroup() != null) patient.setBloodGroup(request.getBloodGroup());
        if (request.getAddress() != null) patient.setAddress(request.getAddress());
        if (request.getEmergencyContact() != null) patient.setEmergencyContact(request.getEmergencyContact());

        userRepository.save(user);
        patient = patientRepository.save(patient);
        return mapToResponse(patient);
    }

    /**
     * Get internal Patient entity by user email (used by other services).
     */
    public Patient getPatientEntityByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
    }

    private PatientResponse mapToResponse(Patient patient) {
        return PatientResponse.builder()
                .id(patient.getId())
                .userId(patient.getUser().getId())
                .name(patient.getUser().getName())
                .email(patient.getUser().getEmail())
                .phone(patient.getUser().getPhone())
                .age(patient.getAge())
                .gender(patient.getGender() != null ? patient.getGender().name() : null)
                .bloodGroup(patient.getBloodGroup())
                .address(patient.getAddress())
                .emergencyContact(patient.getEmergencyContact())
                .build();
    }
}
