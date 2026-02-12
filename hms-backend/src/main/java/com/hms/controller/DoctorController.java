package com.hms.controller;

import com.hms.dto.ApiResponse;
import com.hms.dto.DoctorResponse;
import com.hms.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Doctor Controller - handles doctor listing and profile management.
 */
@RestController
@RequestMapping("/api/doctors")
@CrossOrigin
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    /**
     * GET /api/doctors - Get all doctors (public).
     */
    @GetMapping
    public ResponseEntity<ApiResponse> getAllDoctors() {
        List<DoctorResponse> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(ApiResponse.success("Doctors retrieved", doctors));
    }

    /**
     * GET /api/doctors/{id} - Get doctor by ID (public).
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getDoctorById(@PathVariable Long id) {
        DoctorResponse doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor retrieved", doctor));
    }

    /**
     * GET /api/doctors/specialization/{spec} - Get doctors by specialization (public).
     */
    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<ApiResponse> getDoctorsBySpecialization(
            @PathVariable String specialization) {
        List<DoctorResponse> doctors = doctorService.getDoctorsBySpecialization(specialization);
        return ResponseEntity.ok(ApiResponse.success("Doctors retrieved", doctors));
    }

    /**
     * GET /api/doctors/profile - Get own profile (doctor only).
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        DoctorResponse doctor = doctorService.getDoctorByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", doctor));
    }

    /**
     * PUT /api/doctors/profile - Update own profile (doctor only).
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody DoctorResponse request) {
        DoctorResponse doctor = doctorService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", doctor));
    }

    /**
     * PUT /api/doctors/availability - Update availability (doctor only).
     */
    @PutMapping("/availability")
    public ResponseEntity<ApiResponse> updateAvailability(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Boolean> body) {
        DoctorResponse doctor = doctorService.updateAvailability(
                userDetails.getUsername(), body.get("available"));
        return ResponseEntity.ok(ApiResponse.success("Availability updated", doctor));
    }
}
