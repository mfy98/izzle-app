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
@Table("advertisers")
public class Advertiser {
    @Id
    private Long id;
    private String companyName;
    private String taxNumber;
    private String industry; // Added
    private String websiteUrl; // Added
    private String description; // Added
    private String contactEmail;
    private String contactPhone;
    private String address;
    private String password; 
    private String logoUrl;
    private Boolean isVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
