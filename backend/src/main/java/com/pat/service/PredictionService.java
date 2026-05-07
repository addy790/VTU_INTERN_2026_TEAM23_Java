package com.pat.service;

import com.pat.dto.PredictionResultDTO;
import com.pat.entity.Student;
import com.pat.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Placement Prediction Engine (Feature 4).
 * Predicts placement probability using a weighted 5-factor formula.
 * Generates personalised improvement recommendations.
 * Completely new service — no existing code changed.
 *
 * Formula (100 pts max):
 *   CGPA          → 35 pts  (cgpa/10 * 35)
 *   Skills        → 25 pts  (skillCount/20 * 25, capped)
 *   Projects      → 20 pts  (projectCount/5 * 20, capped)
 *   Internships   → 15 pts  (internshipCount/3 * 15, capped)
 *   Aptitude      → 5 pts   (score/100 * 5)
 */
@Service
public class PredictionService {

    @Autowired
    private StudentRepository studentRepository;

    public PredictionResultDTO predict(UUID studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

        // ── Individual component scores ──────────────────────────────────
        int cgpaScore      = (int) Math.min((student.getCgpa() / 10.0) * 35, 35);

        int skillCount     = student.getSkills() == null ? 0 : student.getSkills().size();
        int skillScore     = (int) Math.min((skillCount / 20.0) * 25, 25);

        int projectCount   = student.getProjectCount() == null ? 0 : student.getProjectCount();
        int projectScore   = (int) Math.min((projectCount / 5.0) * 20, 20);

        int internCount    = student.getInternshipCount() == null ? 0 : student.getInternshipCount();
        int internScore    = (int) Math.min((internCount / 3.0) * 15, 15);

        int aptitude       = student.getAptitudeScore() == null ? 0 : student.getAptitudeScore();
        int aptScore       = (int) Math.min((aptitude / 100.0) * 5, 5);

        int total          = Math.min(cgpaScore + skillScore + projectScore + internScore + aptScore, 99);

        // ── Grade ───────────────────────────────────────────────────────
        String grade = total >= 70 ? "HIGH" : total >= 45 ? "MEDIUM" : "LOW";

        // ── Personalised recommendations ─────────────────────────────────
        List<String> recommendations = new ArrayList<>();

        if (student.getCgpa() < 7.5)
            recommendations.add("Improve your CGPA — target 7.5+ for competitive drives");
        if (skillCount < 8)
            recommendations.add("Add more technical skills (currently " + skillCount + ", aim for 8+)");
        if (skillCount < 5)
            recommendations.add("Focus on core skills: DSA, Java/Python, SQL, Git");
        if (projectCount < 2)
            recommendations.add("Build at least 2 projects and push them to GitHub");
        if (internCount == 0)
            recommendations.add("Complete at least one internship to strengthen your profile");
        if (aptitude < 60)
            recommendations.add("Practice aptitude tests — aim for 60+ score");
        if (student.getResumeUrl() == null || student.getResumeUrl().isBlank())
            recommendations.add("Upload your resume to improve matching accuracy");
        if (recommendations.isEmpty())
            recommendations.add("Great profile! Keep applying to drives and networking on LinkedIn.");

        // ── Breakdown map ────────────────────────────────────────────────
        Map<String, Integer> breakdown = new LinkedHashMap<>();
        breakdown.put("cgpa", cgpaScore);
        breakdown.put("skills", skillScore);
        breakdown.put("projects", projectScore);
        breakdown.put("internships", internScore);
        breakdown.put("aptitude", aptScore);

        return PredictionResultDTO.builder()
                .probability(total)
                .grade(grade)
                .recommendations(recommendations)
                .breakdown(breakdown)
                .build();
    }
}
