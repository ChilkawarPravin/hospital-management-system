package com.hms.dto;

import com.hms.entity.enums.AppointmentStatus;
import lombok.*;

import java.time.LocalDateTime;

/**
 * DTO for appointment response with doctor and patient details.
 */
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AppointmentResponse {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private LocalDateTime appointmentDateTime;
    private AppointmentStatus status;
    private String reason;
    private String notes;
    private Double consultationFee;
    private LocalDateTime createdAt;
    private boolean hasPrescription;
    private boolean hasPayment;
}
