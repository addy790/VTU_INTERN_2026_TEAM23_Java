package com.pat.controller;

import com.pat.dto.ParsedResumeDTO;
import com.pat.service.ResumeParserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

/**
 * Resume upload & parser endpoints (Feature 1).
 * New controller — no existing controllers modified.
 *
 * POST /api/resume/upload/{studentId}    → parse, return preview
 * POST /api/resume/confirm/{studentId}   → confirm & save to profile
 */
@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @Autowired
    private ResumeParserService resumeParserService;

    /**
     * Upload resume → get parsed preview DTO.
     * Student reviews before committing.
     */
    @PostMapping("/upload/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> uploadAndParse(
            @PathVariable UUID studentId,
            @RequestParam("file") MultipartFile file) {
        try {
            ParsedResumeDTO parsed = resumeParserService.parseResume(file, studentId);
            return ResponseEntity.ok(parsed);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to parse resume: " + e.getMessage());
        }
    }

    /**
     * Confirm parsed data → persist to student profile.
     */
    @PostMapping("/confirm/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> confirmAndSave(
            @PathVariable UUID studentId,
            @RequestBody ParsedResumeDTO dto) {
        try {
            resumeParserService.confirmAndSave(studentId, dto);
            return ResponseEntity.ok("Profile updated from resume successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to save: " + e.getMessage());
        }
    }
}
