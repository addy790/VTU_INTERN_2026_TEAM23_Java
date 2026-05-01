package com.pat.controller;

import com.pat.entity.Interview;
import com.pat.repository.InterviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {
    @Autowired
    private InterviewRepository interviewRepository;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Interview>> getStudentInterviews(@PathVariable UUID studentId) {
        return ResponseEntity.ok(interviewRepository.findByStudentId(studentId));
    }

    @PostMapping
    public ResponseEntity<Interview> scheduleInterview(@RequestBody Interview interview) {
        return ResponseEntity.ok(interviewRepository.save(interview));
    }
}
