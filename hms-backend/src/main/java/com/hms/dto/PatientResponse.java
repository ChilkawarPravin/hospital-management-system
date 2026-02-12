package com.hms.dto;

import lombok.*;

/**
 * DTO for patient profile response.
 */
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PatientResponse {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private Integer age;
    private String gender;
    private String bloodGroup;
    private String address;
    private String emergencyContact;
}
