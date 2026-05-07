package com.pat.service;

import com.pat.dto.MatchResultDTO;
import com.pat.entity.Application;
import com.pat.entity.Drive;
import com.pat.entity.Student;
import com.pat.repository.ApplicationRepository;
import com.pat.repository.DriveRepository;
import com.pat.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * AI Job Matching Engine (Feature 2) + Skill Gap Analyzer (Feature 5).
 * Scores each drive against a student profile using a weighted formula.
 * Completely new service — no existing code changed.
 *
 * Scoring (100 pts total):
 *   Skills match  → 50 pts
 *   CGPA          → 30 pts
 *   Department    → 10 pts
 *   Aptitude      → 10 pts
 */
@Service
public class MatchingService {

    @Autowired private StudentRepository studentRepository;
    @Autowired private DriveRepository driveRepository;
    @Autowired private ApplicationRepository applicationRepository;

    // ── Top recommended drives for a student ──────────────────────────────

    public List<MatchResultDTO> getRecommendedDrives(UUID studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

        // IDs of drives the student already applied to
        Set<UUID> appliedDriveIds = applicationRepository
                .findByStudentId(studentId).stream()
                .map(app -> app.getDrive().getId())
                .collect(Collectors.toSet());

        List<Drive> openDrives = driveRepository.findAll().stream()
                .filter(d -> "OPEN".equalsIgnoreCase(d.getStatus()))
                .filter(d -> !appliedDriveIds.contains(d.getId()))
                .collect(Collectors.toList());

        return openDrives.stream()
                .map(drive -> score(student, drive))
                .sorted(Comparator.comparingInt(MatchResultDTO::getMatchScore).reversed())
                .collect(Collectors.toList());
    }

    // ── Ranked candidates for a drive (Recruiter view) ────────────────────

    public List<MatchResultDTO> getRankedCandidates(UUID driveId) {
        Drive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new RuntimeException("Drive not found: " + driveId));

        // Only rank students who have already applied
        List<Application> applications = applicationRepository.findByDriveId(driveId);

        return applications.stream()
                .map(app -> score(app.getStudent(), drive))
                .sorted(Comparator.comparingInt(MatchResultDTO::getMatchScore).reversed())
                .collect(Collectors.toList());
    }

    // ── Skill gap for one student vs one drive ─────────────────────────────

    public MatchResultDTO getGapAnalysis(UUID studentId, UUID driveId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Drive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new RuntimeException("Drive not found"));
        return score(student, drive);
    }

    // ── Core scoring algorithm ─────────────────────────────────────────────

    private MatchResultDTO score(Student student, Drive drive) {
        List<String> studentSkills = normalise(student.getSkills());
        List<String> requiredSkills = normalise(drive.getRequiredSkills());

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String req : requiredSkills) {
            if (studentSkills.contains(req)) matched.add(req);
            else missing.add(req);
        }

        // Skills score (50 pts)
        int skillScore = requiredSkills.isEmpty() ? 30
                : (int) ((double) matched.size() / requiredSkills.size() * 50);

        // CGPA score (30 pts)
        int cgpaScore = (int) Math.min((student.getCgpa() / 10.0) * 30, 30);

        // Department match (10 pts)
        List<String> reqDepts = normalise(drive.getRequiredDepartments());
        boolean deptMatch = reqDepts.isEmpty()
                || reqDepts.contains(student.getBranch().toLowerCase().trim());
        int deptScore = deptMatch ? 10 : 0;

        // Aptitude score (10 pts)
        int aptScore = student.getAptitudeScore() == null ? 5
                : (int) Math.min((student.getAptitudeScore() / 100.0) * 10, 10);

        int total = Math.min(skillScore + cgpaScore + deptScore + aptScore, 100);

        return MatchResultDTO.builder()
                .driveId(drive.getId().toString())
                .driveName(drive.getRole())
                .companyName(drive.getCompanyName())
                .role(drive.getRole())
                .packageAmount(drive.getPackageAmount())
                .deadline(drive.getDeadline() != null ? drive.getDeadline().toString() : "")
                .matchScore(total)
                .matchedSkills(matched)
                .missingSkills(missing)
                .cgpaScore(student.getCgpa())
                .departmentMatch(deptMatch)
                .build();
    }

    private List<String> normalise(List<String> list) {
        if (list == null) return Collections.emptyList();
        return list.stream()
                .map(s -> s.toLowerCase().trim())
                .collect(Collectors.toList());
    }
}
