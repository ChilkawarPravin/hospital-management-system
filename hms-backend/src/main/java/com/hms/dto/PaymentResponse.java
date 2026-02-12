package com.hms.dto;

import com.hms.entity.enums.PaymentMethod;
import com.hms.entity.enums.PaymentStatus;
import lombok.*;

import java.time.LocalDateTime;

/**
 * DTO for payment response.
 */
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PaymentResponse {
    private Long id;
    private Long appointmentId;
    private String doctorName;
    private String patientName;
    private Double amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private String transactionId;
    private LocalDateTime paidAt;
}
