package com.pat.repository;

import com.pat.entity.Application;
import com.pat.entity.Drive;
import com.pat.entity.Student;
import com.pat.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    List<Application> findByStudentId(UUID studentId);
    List<Application> findByDriveId(UUID driveId);
    List<Application> findByDriveIdAndStatus(UUID driveId, ApplicationStatus status);
}
