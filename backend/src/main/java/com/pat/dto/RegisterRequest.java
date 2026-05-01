package com.pat.dto;

import lombok.Data;
import java.util.List;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private String role; // STUDENT, ADMIN, etc.
    private String branch;
    private double cgpa;
    private List<String> skills;
}
