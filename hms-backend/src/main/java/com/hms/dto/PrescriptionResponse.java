package com.hms.dto;

import lombok.*;

import java.time.LocalDateTime;

/**
 * DTO for prescription response.
 */
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PrescriptionResponse {
    private Long id;
    private Long appointmentId;
    private String doctorName;
    private String doctorSpecialization;
    private String patientName;
    private String diagnosis;
    private String medications;
    private String notes;
    private LocalDateTime issuedAt;
    private LocalDateTime appointmentDateTime;
}
