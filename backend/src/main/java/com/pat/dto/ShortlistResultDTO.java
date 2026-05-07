package com.pat.dto;

import lombok.Builder;
import lombok.Data;

/**
 * DTO summarising the result of an auto-shortlist run (Feature 3).
 */
@Data
@Builder
public class ShortlistResultDTO {
    private int total;
    private int shortlisted;
    private int rejected;
    private String driveId;
    private String driveName;
}
