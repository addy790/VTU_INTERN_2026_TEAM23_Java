package com.pat.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

/**
 * DTO for a single drive match result returned by the AI matching engine (Feature 2).
 */
@Data
@Builder
public class MatchResultDTO {
    private String driveId;
    private String driveName;
    private String companyName;
    private String role;
    private String packageAmount;
    private String deadline;
    private int matchScore;           // 0–100
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private double cgpaScore;
    private boolean departmentMatch;
}
