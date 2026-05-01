package com.pat.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DriveRequest {
    private String companyName;
    private String role;
    private String packageAmount;
    private double minCgpa;
    private String eligibilityCriteria;
    private LocalDate deadline;
    private String description;
}
