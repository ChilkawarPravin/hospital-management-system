package com.hms.controller;

import com.hms.dto.ApiResponse;
import com.hms.dto.AppointmentRequest;
import com.hms.dto.AppointmentResponse;
import com.hms.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Appointment Controller - handles appointment booking and management.
 */
@RestController
@RequestMapping("/api/appointments")
@CrossOrigin
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    /**
     * POST /api/appointments - Book an appointment (patient only).
     */
    @PostMapping
    public ResponseEntity<ApiResponse> bookAppointment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AppointmentRequest request) {
        AppointmentResponse appointment = appointmentService.bookAppointment(
                userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Appointment booked successfully", appointment));
    }

    /**
     * GET /api/appointments/patient - Get patient's appointments.
     */
    @GetMapping("/patient")
    public ResponseEntity<ApiResponse> getPatientAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<AppointmentResponse> appointments = appointmentService.getPatientAppointments(
                userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Appointments retrieved", appointments));
    }

    /**
     * GET /api/appointments/doctor - Get doctor's appointments.
     */
    @GetMapping("/doctor")
    public ResponseEntity<ApiResponse> getDoctorAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<AppointmentResponse> appointments = appointmentService.getDoctorAppointments(
                userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Appointments retrieved", appointments));
    }

    /**
     * GET /api/appointments/doctor/today - Get doctor's today appointments.
     */
    @GetMapping("/doctor/today")
    public ResponseEntity<ApiResponse> getDoctorTodayAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<AppointmentResponse> appointments = appointmentService.getDoctorTodayAppointments(
                userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Today's appointments retrieved", appointments));
    }

    /**
     * GET /api/appointments/{id} - Get appointment by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getAppointmentById(@PathVariable Long id) {
        AppointmentResponse appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(ApiResponse.success("Appointment retrieved", appointment));
    }

    /**
     * PUT /api/appointments/{id}/status - Update appointment status (doctor only).
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        AppointmentResponse appointment = appointmentService.updateStatus(
                id, body.get("status"), userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Appointment status updated", appointment));
    }
}
