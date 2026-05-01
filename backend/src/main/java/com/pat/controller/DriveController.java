package com.pat.controller;

import com.pat.dto.DriveRequest;
import com.pat.service.DriveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/drives")
public class DriveController {
    @Autowired
    private DriveService driveService;

    @GetMapping
    public ResponseEntity<?> getAllDrives() {
        return ResponseEntity.ok(driveService.getAllDrives());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createDrive(@RequestBody DriveRequest request) {
        return ResponseEntity.ok(driveService.createDrive(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDriveById(@PathVariable UUID id) {
        return ResponseEntity.ok(driveService.getDriveById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDrive(@PathVariable UUID id) {
        driveService.deleteDrive(id);
        return ResponseEntity.ok("Drive deleted successfully");
    }
}
