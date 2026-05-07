package com.pat.controller;

import com.pat.entity.Student;
import com.pat.service.StudentService;
import com.pat.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    @Autowired
    private StudentService studentService;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/{id}/resume")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<?> uploadResume(@PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        String url = fileStorageService.storeFile(file, id.toString());
        Student student = studentService.getStudentById(id);
        student.setResumeUrl(url);
        studentService.updateStudent(id, student);
        return ResponseEntity.ok("Resume uploaded successfully! Path: " + url);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('RECRUITER')")
    public ResponseEntity<?> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable UUID id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<?> updateStudent(@PathVariable UUID id, @RequestBody Student student) {
        return ResponseEntity.ok(studentService.updateStudent(id, student));
    }

    @GetMapping("/unverified")
    @PreAuthorize("hasRole('COORDINATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getUnverifiedStudents() {
        return ResponseEntity.ok(studentService.getUnverifiedStudents());
    }

    @PatchMapping("/{id}/verify")
    @PreAuthorize("hasRole('COORDINATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> verifyStudent(@PathVariable UUID id) {
        studentService.verifyStudent(id);
        return ResponseEntity.ok("Student verified successfully");
    }
}
