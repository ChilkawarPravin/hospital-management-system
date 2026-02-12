package com.hms.service;

import com.hms.dto.PrescriptionRequest;
import com.hms.dto.PrescriptionResponse;
import com.hms.entity.*;
import com.hms.entity.enums.AppointmentStatus;
import com.hms.exception.BadRequestException;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Prescription Service - handles prescription management.
 */
@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private DoctorService doctorService;
    @Autowired
    private PatientService patientService;

    /**
     * Create a prescription (doctor action).
     * Appointment must be completed before a prescription can be issued.
     */
    @Transactional
    public PrescriptionResponse createPrescription(String doctorEmail, PrescriptionRequest request) {
        Doctor doctor = doctorService.getDoctorEntityByEmail(doctorEmail);

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Appointment not found with id: " + request.getAppointmentId()));

        // Verify the doctor owns this appointment
        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new BadRequestException("You can only create prescriptions for your own appointments");
        }

        // Check appointment status
        if (appointment.getStatus() != AppointmentStatus.COMPLETED &&
                appointment.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new BadRequestException(
                    "Prescriptions can only be issued for confirmed or completed appointments");
        }

        // Check if prescription already exists
        if (prescriptionRepository.existsByAppointmentId(request.getAppointmentId())) {
            throw new BadRequestException("Prescription already exists for this appointment");
        }

        Prescription prescription = Prescription.builder()
                .appointment(appointment)
                .doctor(doctor)
                .patient(appointment.getPatient())
                .diagnosis(request.getDiagnosis())
                .medications(request.getMedications())
                .notes(request.getNotes())
                .build();

        // Auto-complete the appointment when prescription is issued
        if (appointment.getStatus() == AppointmentStatus.CONFIRMED) {
            appointment.setStatus(AppointmentStatus.COMPLETED);
            appointmentRepository.save(appointment);
        }

        prescription = prescriptionRepository.save(prescription);
        return mapToResponse(prescription);
    }

    /**
     * Get prescription by appointment ID.
     */
    public PrescriptionResponse getPrescriptionByAppointment(Long appointmentId) {
        Prescription prescription = prescriptionRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Prescription not found for appointment id: " + appointmentId));
        return mapToResponse(prescription);
    }

    /**
     * Get all prescriptions for a patient.
     */
    public List<PrescriptionResponse> getPatientPrescriptions(String patientEmail) {
        Patient patient = patientService.getPatientEntityByEmail(patientEmail);
        return prescriptionRepository.findByPatientIdOrderByIssuedAtDesc(patient.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all prescriptions issued by a doctor.
     */
    public List<PrescriptionResponse> getDoctorPrescriptions(String doctorEmail) {
        Doctor doctor = doctorService.getDoctorEntityByEmail(doctorEmail);
        return prescriptionRepository.findByDoctorIdOrderByIssuedAtDesc(doctor.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PrescriptionResponse mapToResponse(Prescription prescription) {
        return PrescriptionResponse.builder()
                .id(prescription.getId())
                .appointmentId(prescription.getAppointment().getId())
                .doctorName(prescription.getDoctor().getUser().getName())
                .doctorSpecialization(prescription.getDoctor().getSpecialization())
                .patientName(prescription.getPatient().getUser().getName())
                .diagnosis(prescription.getDiagnosis())
                .medications(prescription.getMedications())
                .notes(prescription.getNotes())
                .issuedAt(prescription.getIssuedAt())
                .appointmentDateTime(prescription.getAppointment().getAppointmentDateTime())
                .build();
    }
}
