package com.pat.service;

import com.pat.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private DriveRepository driveRepository;
    
    @Autowired
    private ApplicationRepository applicationRepository;

    public Map<String, Object> getOverview() {
        long totalStudents = studentRepository.count();
        long activeDrives = driveRepository.count(); // Simplified
        long placedStudents = studentRepository.findAll().stream().filter(s -> s.isPlaced()).count();
        double placementRate = totalStudents > 0 ? (double) placedStudents / totalStudents * 100 : 0;
        
        String highestPackage = studentRepository.findAll().stream()
                .filter(s -> s.getPackageAmount() != null)
                .map(s -> s.getPackageAmount())
                .findFirst().orElse("0 LPA"); // Simplified logic

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", totalStudents);
        stats.put("activeDrives", activeDrives);
        stats.put("placementRate", String.format("%.1f%%", placementRate));
        stats.put("highestPackage", highestPackage);
        
        return stats;
    }
}
