package com.pat.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class ApplicationRequest {
    private UUID studentId;
    private UUID driveId;
}
