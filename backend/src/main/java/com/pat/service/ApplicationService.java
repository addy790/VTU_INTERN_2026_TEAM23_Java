package com.pat.service;

import com.pat.dto.ApplicationRequest;
import com.pat.entity.*;
import com.pat.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ApplicationService {
    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private DriveRepository driveRepository;

    public Application applyForDrive(ApplicationRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Drive drive = driveRepository.findById(request.getDriveId())
                .orElseThrow(() -> new RuntimeException("Drive not found"));

        Application application = Application.builder()
                .student(student)
                .drive(drive)
                .status(ApplicationStatus.APPLIED)
                .appliedAt(LocalDateTime.now())
                .build();

        return applicationRepository.save(application);
    }

    public List<Application> getStudentApplications(UUID studentId) {
        return applicationRepository.findByStudentId(studentId);
    }

    public List<Application> getDriveApplications(UUID driveId) {
        return applicationRepository.findByDriveId(driveId);
    }

    public Application updateStatus(UUID id, String status) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus(ApplicationStatus.valueOf(status.toUpperCase()));
        
        if (application.getStatus() == ApplicationStatus.SELECTED) {
            Student s = application.getStudent();
            s.setPlaced(true);
            s.setPackageAmount(application.getDrive().getPackageAmount());
            studentRepository.save(s);
        }
        
        return applicationRepository.save(application);
    }

    public Map<ApplicationStatus, List<Application>> getPipeline() {
        return applicationRepository.findAll().stream()
                .collect(Collectors.groupingBy(Application::getStatus));
    }
}
