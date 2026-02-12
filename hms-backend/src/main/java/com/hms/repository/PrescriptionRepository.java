package com.hms.repository;

import com.hms.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    Optional<Prescription> findByAppointmentId(Long appointmentId);
    List<Prescription> findByPatientIdOrderByIssuedAtDesc(Long patientId);
    List<Prescription> findByDoctorIdOrderByIssuedAtDesc(Long doctorId);
    boolean existsByAppointmentId(Long appointmentId);
}
