package com.hms.controller;

import com.hms.dto.ApiResponse;
import com.hms.dto.PaymentRequest;
import com.hms.dto.PaymentResponse;
import com.hms.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Payment Controller - handles payment processing.
 */
@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /**
     * POST /api/payments - Make a payment (patient only).
     */
    @PostMapping
    public ResponseEntity<ApiResponse> makePayment(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse payment = paymentService.makePayment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment successful", payment));
    }

    /**
     * GET /api/payments/appointment/{id} - Get payment by appointment.
     */
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<ApiResponse> getPaymentByAppointment(
            @PathVariable Long appointmentId) {
        PaymentResponse payment = paymentService.getPaymentByAppointment(appointmentId);
        return ResponseEntity.ok(ApiResponse.success("Payment retrieved", payment));
    }
}
