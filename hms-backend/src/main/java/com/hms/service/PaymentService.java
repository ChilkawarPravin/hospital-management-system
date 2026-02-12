package com.hms.service;

import com.hms.dto.PaymentRequest;
import com.hms.dto.PaymentResponse;
import com.hms.entity.Appointment;
import com.hms.entity.Payment;
import com.hms.entity.enums.AppointmentStatus;
import com.hms.entity.enums.PaymentMethod;
import com.hms.entity.enums.PaymentStatus;
import com.hms.exception.BadRequestException;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Payment Service - handles payment processing for appointments.
 */
@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;

    /**
     * Process a payment for an appointment.
     */
    @Transactional
    public PaymentResponse makePayment(PaymentRequest request) {
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Appointment not found with id: " + request.getAppointmentId()));

        // Check if appointment is confirmed
        if (appointment.getStatus() != AppointmentStatus.CONFIRMED &&
                appointment.getStatus() != AppointmentStatus.COMPLETED) {
            throw new BadRequestException(
                    "Payment can only be made for confirmed or completed appointments");
        }

        // Check if payment already exists
        if (paymentRepository.existsByAppointmentId(request.getAppointmentId())) {
            throw new BadRequestException("Payment has already been made for this appointment");
        }

        Payment payment = Payment.builder()
                .appointment(appointment)
                .amount(request.getAmount())
                .paymentMethod(PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase()))
                .status(PaymentStatus.COMPLETED)
                .transactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .build();

        payment = paymentRepository.save(payment);
        return mapToResponse(payment);
    }

    /**
     * Get payment by appointment ID.
     */
    public PaymentResponse getPaymentByAppointment(Long appointmentId) {
        Payment payment = paymentRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found for appointment id: " + appointmentId));
        return mapToResponse(payment);
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .appointmentId(payment.getAppointment().getId())
                .doctorName(payment.getAppointment().getDoctor().getUser().getName())
                .patientName(payment.getAppointment().getPatient().getUser().getName())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .paidAt(payment.getPaidAt())
                .build();
    }
}
