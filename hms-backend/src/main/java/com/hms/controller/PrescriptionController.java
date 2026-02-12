package com.hms.controller;

import com.hms.dto.ApiResponse;
import com.hms.dto.PrescriptionRequest;
import com.hms.dto.PrescriptionResponse;
import com.hms.service.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Prescription Controller - handles prescription management.
 */
@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    /**
     * POST /api/prescriptions - Create prescription (doctor only).
     */
    @PostMapping
    public ResponseEntity<ApiResponse> createPrescription(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PrescriptionRequest request) {
        PrescriptionResponse prescription = prescriptionService.createPrescription(
                userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Prescription created", prescription));
    }

    /**
     * GET /api/prescriptions/appointment/{id} - Get prescription by appointment.
     */
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<ApiResponse> getPrescriptionByAppointment(
            @PathVariable Long appointmentId) {
        PrescriptionResponse prescription = prescriptionService.getPrescriptionByAppointment(
                appointmentId);
        return ResponseEntity.ok(ApiResponse.success("Prescription retrieved", prescription));
    }

    /**
     * GET /api/prescriptions/patient - Get patient's prescriptions.
     */
    @GetMapping("/patient")
    public ResponseEntity<ApiResponse> getPatientPrescriptions(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<PrescriptionResponse> prescriptions = prescriptionService.getPatientPrescriptions(
                userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Prescriptions retrieved", prescriptions));
    }

    /**
     * GET /api/prescriptions/doctor - Get doctor's issued prescriptions.
     */
    @GetMapping("/doctor")
    public ResponseEntity<ApiResponse> getDoctorPrescriptions(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<PrescriptionResponse> prescriptions = prescriptionService.getDoctorPrescriptions(
                userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Prescriptions retrieved", prescriptions));
    }
}
