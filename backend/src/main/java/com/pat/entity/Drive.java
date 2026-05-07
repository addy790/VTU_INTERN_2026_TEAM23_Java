package com.pat.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
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

    // ═══ AI Feature Fields (additive) ═══
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "drive_required_skills", joinColumns = @JoinColumn(name = "drive_id"))
    @Column(name = "skill")
    @Builder.Default
    private List<String> requiredSkills = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "drive_required_departments", joinColumns = @JoinColumn(name = "drive_id"))
    @Column(name = "department")
    @Builder.Default
    private List<String> requiredDepartments = new ArrayList<>();

    @Builder.Default
    private Integer minAptitudeScore = 0;
}
