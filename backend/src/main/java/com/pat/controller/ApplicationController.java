package com.pat.controller;

import com.pat.dto.ApplicationRequest;
import com.pat.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> apply(@RequestBody ApplicationRequest request) {
        return ResponseEntity.ok(applicationService.applyForDrive(request));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getByStudent(@PathVariable UUID studentId) {
        return ResponseEntity.ok(applicationService.getStudentApplications(studentId));
    }

    @GetMapping("/drive/{driveId}")
    public ResponseEntity<?> getByDrive(@PathVariable UUID driveId) {
        return ResponseEntity.ok(applicationService.getDriveApplications(driveId));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable UUID id, @RequestParam String status) {
        return ResponseEntity.ok(applicationService.updateStatus(id, status));
    }

    @GetMapping("/pipeline")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<?> getPipeline() {
        return ResponseEntity.ok(applicationService.getPipeline());
    }
}
