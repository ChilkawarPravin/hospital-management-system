package com.hms.service;

import com.hms.dto.AppointmentRequest;
import com.hms.dto.AppointmentResponse;
import com.hms.entity.*;
import com.hms.entity.enums.AppointmentStatus;
import com.hms.exception.BadRequestException;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Appointment Service - handles appointment booking and management.
 */
@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PatientService patientService;
    @Autowired
    private PrescriptionRepository prescriptionRepository;
    @Autowired
    private PaymentRepository paymentRepository;

    /**
     * Book a new appointment (patient action).
     */
    @Transactional
    public AppointmentResponse bookAppointment(String patientEmail, AppointmentRequest request) {
        Patient patient = patientService.getPatientEntityByEmail(patientEmail);

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Doctor not found with id: " + request.getDoctorId()));

        if (doctor.getAvailable() != null && !doctor.getAvailable()) {
            throw new BadRequestException("Doctor is not available for appointments");
        }

        if (request.getAppointmentDateTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Appointment date must be in the future");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDateTime(request.getAppointmentDateTime())
                .status(AppointmentStatus.PENDING)
                .reason(request.getReason())
                .build();

        appointment = appointmentRepository.save(appointment);
        return mapToResponse(appointment);
    }

    /**
     * Get appointments for a patient.
     */
    public List<AppointmentResponse> getPatientAppointments(String patientEmail) {
        Patient patient = patientService.getPatientEntityByEmail(patientEmail);
        return appointmentRepository.findByPatientIdOrderByAppointmentDateTimeDesc(patient.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Get appointments for a doctor by email.
     */
    public List<AppointmentResponse> getDoctorAppointments(String doctorEmail) {
        User user = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
        return appointmentRepository.findByDoctorIdOrderByAppointmentDateTimeDesc(doctor.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Update appointment status (doctor action).
     */
    @Transactional
    public AppointmentResponse updateStatus(Long appointmentId, String status, String doctorEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Appointment not found with id: " + appointmentId));

        User user = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new BadRequestException("You can only update your own appointments");
        }

        AppointmentStatus newStatus = AppointmentStatus.valueOf(status.toUpperCase());
        appointment.setStatus(newStatus);
        appointment = appointmentRepository.save(appointment);
        return mapToResponse(appointment);
    }

    /**
     * Get today's appointments for a doctor.
     */
    public List<AppointmentResponse> getDoctorTodayAppointments(String doctorEmail) {
        User user = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        return appointmentRepository.findByDoctorIdAndAppointmentDateTimeBetween(
                        doctor.getId(), startOfDay, endOfDay)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Get appointment by ID.
     */
    public AppointmentResponse getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Appointment not found with id: " + id));
        return mapToResponse(appointment);
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        return AppointmentResponse.builder()
                .id(appointment.getId())
                .patientId(appointment.getPatient().getId())
                .patientName(appointment.getPatient().getUser().getName())
                .doctorId(appointment.getDoctor().getId())
                .doctorName(appointment.getDoctor().getUser().getName())
                .doctorSpecialization(appointment.getDoctor().getSpecialization())
                .appointmentDateTime(appointment.getAppointmentDateTime())
                .status(appointment.getStatus())
                .reason(appointment.getReason())
                .notes(appointment.getNotes())
                .consultationFee(appointment.getDoctor().getConsultationFee())
                .createdAt(appointment.getCreatedAt())
                .hasPrescription(prescriptionRepository.existsByAppointmentId(appointment.getId()))
                .hasPayment(paymentRepository.existsByAppointmentId(appointment.getId()))
                .build();
    }
}
