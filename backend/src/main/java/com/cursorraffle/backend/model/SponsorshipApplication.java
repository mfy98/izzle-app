package com.cursorraffle.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("sponsorship_applications")
public class SponsorshipApplication {
    @Id
    private Long id;
    private Long advertiserId;
    private String advertiserName;
    private String type; // DAILY, WEEKLY, MONTHLY
    private Double bidAmount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status; // PENDING, APPROVED, REJECTED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

