package com.hms.controller;

import com.hms.dto.ApiResponse;
import com.hms.dto.PatientResponse;
import com.hms.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Patient Controller - handles patient profile management.
 */
@RestController
@RequestMapping("/api/patients")
@CrossOrigin
public class PatientController {

    @Autowired
    private PatientService patientService;

    /**
     * GET /api/patients/profile - Get own profile.
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        PatientResponse patient = patientService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", patient));
    }

    /**
     * PUT /api/patients/profile - Update own profile.
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PatientResponse request) {
        PatientResponse patient = patientService.updateProfile(
                userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", patient));
    }
}
