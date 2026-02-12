package com.hms.dto;

import lombok.*;

/**
 * DTO for doctor listing/profile response.
 */
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class DoctorResponse {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String specialization;
    private String qualification;
    private Integer experienceYears;
    private Double consultationFee;
    private Boolean available;
    private String bio;
}
