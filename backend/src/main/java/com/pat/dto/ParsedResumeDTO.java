package com.pat.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

/**
 * DTO returned by the resume parser preview endpoint.
 * Student can review and edit before confirming to profile.
 */
@Data
@Builder
public class ParsedResumeDTO {
    private String name;
    private String email;
    private String phone;
    private List<String> skills;
    private String education;
    private int projectCount;
    private int internshipCount;
    private String rawText;        // truncated preview for display
    private String resumeUrl;      // saved file path
}
