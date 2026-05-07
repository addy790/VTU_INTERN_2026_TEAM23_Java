package com.pat.service;

import com.pat.dto.ShortlistResultDTO;
import com.pat.entity.Application;
import com.pat.entity.ApplicationStatus;
import com.pat.entity.Drive;
import com.pat.entity.Student;
import com.pat.repository.ApplicationRepository;
import com.pat.repository.DriveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Auto Shortlisting Engine (Feature 3).
 * Evaluates all APPLIED candidates for a drive against configurable criteria
 * and bulk-updates status to SHORTLISTED or REJECTED.
 * Completely new service — no existing code changed.
 */
@Service
public class ShortlistService {

    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private DriveRepository driveRepository;
    @Autowired private NotificationService notificationService;

    /**
     * Run auto-shortlisting for a drive.
     * Uses drive's own criteria: minCgpa, requiredSkills, requiredDepartments, minAptitudeScore.
     * Only processes applications currently in APPLIED status.
     */
    @Transactional
    public ShortlistResultDTO autoShortlist(UUID driveId) {
        Drive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new RuntimeException("Drive not found: " + driveId));

        List<Application> applied = applicationRepository
                .findByDriveIdAndStatus(driveId, ApplicationStatus.APPLIED);

        int shortlisted = 0;
        int rejected = 0;

        for (Application app : applied) {
            Student student = app.getStudent();
            boolean passes = meetsMinCgpa(student, drive)
                    && meetsSkillRequirements(student, drive)
                    && meetsDepartmentRequirement(student, drive)
                    && meetsAptitudeRequirement(student, drive);

            if (passes) {
                app.setStatus(ApplicationStatus.SHORTLISTED);
                applicationRepository.save(app);
                shortlisted++;
                // Notify student in real-time
                notificationService.createNotification(
                        student.getId(),
                        "🎉 You've been Shortlisted!",
                        "You have been shortlisted for " + drive.getRole()
                                + " at " + drive.getCompanyName(),
                        "SHORTLIST"
                );
            } else {
                app.setStatus(ApplicationStatus.REJECTED);
                applicationRepository.save(app);
                rejected++;
                notificationService.createNotification(
                        student.getId(),
                        "Application Update",
                        "Your application for " + drive.getRole()
                                + " at " + drive.getCompanyName()
                                + " was not shortlisted this time.",
                        "REJECTION"
                );
            }
        }

        return ShortlistResultDTO.builder()
                .driveId(driveId.toString())
                .driveName(drive.getCompanyName() + " — " + drive.getRole())
                .total(applied.size())
                .shortlisted(shortlisted)
                .rejected(rejected)
                .build();
    }

    // ── Criteria checks ──────────────────────────────────────────────────

    private boolean meetsMinCgpa(Student s, Drive d) {
        return s.getCgpa() >= d.getMinCgpa();
    }

    private boolean meetsSkillRequirements(Student s, Drive d) {
        if (d.getRequiredSkills() == null || d.getRequiredSkills().isEmpty()) return true;
        List<String> studentSkills = s.getSkills() == null ? List.of()
                : s.getSkills().stream().map(String::toLowerCase).toList();
        long matched = d.getRequiredSkills().stream()
                .map(String::toLowerCase)
                .filter(studentSkills::contains)
                .count();
        // Must match at least 50% of required skills
        return matched >= Math.ceil(d.getRequiredSkills().size() * 0.5);
    }

    private boolean meetsDepartmentRequirement(Student s, Drive d) {
        if (d.getRequiredDepartments() == null || d.getRequiredDepartments().isEmpty()) return true;
        return d.getRequiredDepartments().stream()
                .anyMatch(dept -> dept.equalsIgnoreCase(s.getBranch()));
    }

    private boolean meetsAptitudeRequirement(Student s, Drive d) {
        if (d.getMinAptitudeScore() == null || d.getMinAptitudeScore() == 0) return true;
        if (s.getAptitudeScore() == null) return false;
        return s.getAptitudeScore() >= d.getMinAptitudeScore();
    }
}
