package com.hms.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Doctor entity - stores doctor-specific information.
 * Linked to User entity via one-to-one relationship.
 */
@Entity
@Table(name = "doctors")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String specialization;

    private String qualification;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "consultation_fee")
    private Double consultationFee;

    @Column(columnDefinition = "boolean default true")
    private Boolean available = true;

    @Column(columnDefinition = "TEXT")
    private String bio;
}
