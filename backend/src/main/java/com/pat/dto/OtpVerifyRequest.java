package com.pat.dto;

import lombok.Data;

@Data
public class OtpVerifyRequest {
    private String email;
    private String code;
}
