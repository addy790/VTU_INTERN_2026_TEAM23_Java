package com.pat.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path root = Paths.get("uploads");

    public String saveResume(MultipartFile file, UUID studentId) {
        try {
            if (!Files.exists(root)) {
                Files.createDirectory(root);
            }
            if (!Files.exists(root.resolve("resumes"))) {
                Files.createDirectory(root.resolve("resumes"));
            }
            
            String fileName = studentId.toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), root.resolve("resumes").resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            return "/api/files/resumes/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Could not store formatting file. Error: " + e.getMessage());
        }
    }
}
