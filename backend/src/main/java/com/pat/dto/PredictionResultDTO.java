package com.pat.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;
import java.util.List;

/**
 * DTO for placement probability prediction result (Feature 4).
 */
@Data
@Builder
public class PredictionResultDTO {
    private int probability;          // 0–99 %
    private String grade;             // HIGH / MEDIUM / LOW
    private List<String> recommendations;
    private Map<String, Integer> breakdown; // cgpa, skills, projects, internships, aptitude
}
