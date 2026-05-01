package com.pat.controller;

import com.pat.dto.DashboardStatsDTO;
import com.pat.entity.User;
import com.pat.entity.Student;
import com.pat.repository.UserRepository;
import com.pat.repository.StudentRepository;
import com.pat.repository.ApplicationRepository;
import com.pat.service.AnalyticsService;
import com.pat.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername()).get();
        
        Map<String, Object> stats = new HashMap<>();
        
        if (user.getRole().name().equals("STUDENT")) {
            Student student = studentRepository.findAll().stream()
                    .filter(s -> s.getUser().getId().equals(user.getId()))
                    .findFirst().orElse(null);
            
            if (student != null) {
                stats.put("cgpa", student.getCgpa());
                stats.put("appliedCount", applicationRepository.findByStudentId(student.getId()).size());
                stats.put("isPlaced", student.isPlaced());
                stats.put("branch", student.getBranch());
            }
        } else {
            // Provide overview for Admin/Coordinator/Recruiter
            stats = analyticsService.getOverview();
        }

        return ResponseEntity.ok(DashboardStatsDTO.builder()
                .userName(user.getName())
                .userRole(user.getRole().name())
                .stats(stats)
                .build());
    }
}
