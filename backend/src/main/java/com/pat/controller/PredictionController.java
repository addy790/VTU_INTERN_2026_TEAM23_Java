package com.pat.controller;

import com.pat.dto.PredictionResultDTO;
import com.pat.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Placement Prediction endpoint (Feature 4).
 * New controller — no existing controllers modified.
 *
 * GET /api/prediction/{studentId}   → placement probability + recommendations
 */
@RestController
@RequestMapping("/api/prediction")
public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    @GetMapping("/{studentId}")
    public ResponseEntity<PredictionResultDTO> predict(@PathVariable UUID studentId) {
        return ResponseEntity.ok(predictionService.predict(studentId));
    }
}
