package com.pat.controller;

import com.pat.dto.MatchResultDTO;
import com.pat.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * AI Job Matching + Skill Gap endpoints (Features 2 & 5).
 * New controller — no existing controllers modified.
 *
 * GET /api/matching/student/{id}          → recommended drives for student
 * GET /api/matching/drive/{driveId}       → ranked candidates for a drive
 * GET /api/matching/gap/{studentId}/{driveId} → skill gap for one pair
 */
@RestController
@RequestMapping("/api/matching")
public class MatchingController {

    @Autowired
    private MatchingService matchingService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<MatchResultDTO>> getRecommendedDrives(
            @PathVariable UUID studentId) {
        return ResponseEntity.ok(matchingService.getRecommendedDrives(studentId));
    }

    @GetMapping("/drive/{driveId}")
    public ResponseEntity<List<MatchResultDTO>> getRankedCandidates(
            @PathVariable UUID driveId) {
        return ResponseEntity.ok(matchingService.getRankedCandidates(driveId));
    }

    @GetMapping("/gap/{studentId}/{driveId}")
    public ResponseEntity<MatchResultDTO> getGapAnalysis(
            @PathVariable UUID studentId,
            @PathVariable UUID driveId) {
        return ResponseEntity.ok(matchingService.getGapAnalysis(studentId, driveId));
    }
}
