package com.pat.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "drives")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Drive {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String companyName;
    private String role;
    private String packageAmount;
    private double minCgpa;
    private String eligibilityCriteria;
    private LocalDate deadline;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Builder.Default
    private String status = "OPEN";
}
