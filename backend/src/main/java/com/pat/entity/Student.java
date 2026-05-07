package com.pat.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {
    @Id
    private UUID id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    private String name;
    
    private String phone;
    private String alternateEmail;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    private String githubUrl;
    private String linkedInUrl;
    
    private Integer graduationYear;
    
    @Column(nullable = false)
    private String branch;
    
    private double cgpa;
    
    @ElementCollection
    private List<String> skills;
    
    private String resumeUrl;
    
    private boolean verified = false;
    
    private boolean placed = false;
    
    private String packageAmount;

    // ═══ AI Feature Fields (additive) ═══
    private Integer internshipCount = 0;
    private Integer projectCount = 0;
    private Integer aptitudeScore = 0;

    @Column(columnDefinition = "TEXT")
    private String resumeText;
}
