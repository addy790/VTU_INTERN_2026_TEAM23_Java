package com.pat.service;

import com.pat.dto.DriveRequest;
import com.pat.entity.Drive;
import com.pat.repository.DriveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class DriveService {
    @Autowired
    private DriveRepository driveRepository;

    public List<Drive> getAllDrives() {
        return driveRepository.findAll();
    }

    public Drive createDrive(DriveRequest request) {
        Drive drive = Drive.builder()
                .companyName(request.getCompanyName())
                .role(request.getRole())
                .packageAmount(request.getPackageAmount())
                .eligibilityCriteria(request.getEligibilityCriteria())
                .deadline(request.getDeadline())
                .description(request.getDescription())
                .status("OPEN")
                .build();
        return driveRepository.save(drive);
    }

    public Drive getDriveById(UUID id) {
        return driveRepository.findById(id).orElseThrow(() -> new RuntimeException("Drive not found"));
    }

    public void deleteDrive(UUID id) {
        driveRepository.deleteById(id);
    }
}
