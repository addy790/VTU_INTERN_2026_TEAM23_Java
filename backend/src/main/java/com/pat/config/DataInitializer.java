package com.pat.config;

import com.pat.entity.*;
import com.pat.repository.*;
import com.pat.entity.Role;
import com.pat.entity.User;
import com.pat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriveRepository driveRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Users
        if (!userRepository.existsByEmail("admin@pat.com")) {
            User admin = User.builder()
                    .email("admin@pat.com")
                    .name("Main Admin")
                    .password(encoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .verified(true)
                    .build();
            userRepository.save(admin);
        }
        
        if (!userRepository.existsByEmail("recruiter@northwind.com")) {
            User recruiter = User.builder()
                    .email("recruiter@northwind.com")
                    .name("Recruiter One")
                    .password(encoder.encode("recruiter123"))
                    .role(Role.RECRUITER)
                    .verified(true)
                    .build();
            userRepository.save(recruiter);
        }

        if (!userRepository.existsByEmail("student@pat.com")) {
            User studentUser = User.builder()
                    .email("student@pat.com")
                    .name("John Doe")
                    .password(encoder.encode("student123"))
                    .role(Role.STUDENT)
                    .verified(true)
                    .build();
            userRepository.save(studentUser);

            Student student = Student.builder()
                    .user(studentUser)
                    .name("John Doe")
                    .branch("Computer Science")
                    .cgpa(9.2)
                    .skills(java.util.Arrays.asList("Java", "Spring Boot", "React", "Docker"))
                    .verified(true)
                    .build();
            studentRepository.save(student);
            System.out.println("Dummy Student seeded successfully!");
        }

        // Seed Job Drives
        if (driveRepository.count() == 0) {
            Drive d1 = Drive.builder()
                    .companyName("Google")
                    .role("Software Engineer")
                    .packageAmount("32 LPA")
                    .minCgpa(8.5)
                    .deadline(java.time.LocalDate.now().plusDays(30))
                    .status("OPEN")
                    .build();

            Drive d2 = Drive.builder()
                    .companyName("Microsoft")
                    .role("Program Manager")
                    .packageAmount("28 LPA")
                    .minCgpa(8.0)
                    .deadline(java.time.LocalDate.now().plusDays(15))
                    .status("OPEN")
                    .build();

            Drive d3 = Drive.builder()
                    .companyName("Netflix")
                    .role("Backend Engineer")
                    .packageAmount("42 LPA")
                    .minCgpa(9.0)
                    .deadline(java.time.LocalDate.now().plusDays(40))
                    .status("OPEN")
                    .build();

            driveRepository.saveAll(java.util.Arrays.asList(d1, d2, d3));
            System.out.println("Dummy Job Drives seeded successfully!");

            // Seed Applications
            studentRepository.findAll().stream().findFirst().ifPresent(student -> {
                if (applicationRepository.count() == 0) {
                    Application a1 = Application.builder()
                            .student(student)
                            .drive(d1)
                            .status(com.pat.entity.ApplicationStatus.APPLIED)
                            .appliedAt(java.time.LocalDateTime.now())
                            .build();
                    applicationRepository.save(a1);
                    
                    Application a2 = Application.builder()
                            .student(student)
                            .drive(d2)
                            .status(com.pat.entity.ApplicationStatus.SHORTLISTED)
                            .appliedAt(java.time.LocalDateTime.now())
                            .build();
                    applicationRepository.save(a2);
                    
                    System.out.println("Dummy Applications seeded for: " + student.getName());
                }
            });
        }
    }
}
