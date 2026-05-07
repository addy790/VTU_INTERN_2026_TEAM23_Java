package com.pat.service;

import com.pat.dto.ParsedResumeDTO;
import com.pat.entity.Student;
import com.pat.repository.StudentRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * AI Resume Parser (Feature 1).
 * Extracts structured data from PDF/DOCX resumes using
 * Apache PDFBox, Apache POI, and regex NLP patterns.
 * Completely new service — no existing code changed.
 */
@Service
public class ResumeParserService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // ─────────────────────────────────────────────
    // Master skill keyword dictionary
    // ─────────────────────────────────────────────
    private static final List<String> KNOWN_SKILLS = List.of(
            "java", "python", "c", "c++", "javascript", "typescript", "kotlin", "swift",
            "spring", "spring boot", "hibernate", "jpa", "react", "angular", "vue",
            "node.js", "nodejs", "express", "django", "flask", "fastapi",
            "html", "css", "tailwind", "bootstrap", "sass",
            "sql", "mysql", "postgresql", "mongodb", "redis", "cassandra",
            "aws", "azure", "gcp", "docker", "kubernetes", "jenkins",
            "git", "github", "gitlab", "bitbucket", "linux", "bash",
            "machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn",
            "data science", "pandas", "numpy", "matplotlib",
            "rest api", "graphql", "microservices", "kafka", "rabbitmq",
            "android", "ios", "flutter", "react native",
            "dsa", "data structures", "algorithms", "system design",
            "agile", "scrum", "jira", "figma", "postman"
    );

    // ─────────────────────────────────────────────
    // Public API
    // ─────────────────────────────────────────────

    /**
     * Parse a resume file → return preview DTO (does NOT save to DB).
     * Student confirms separately via confirmAndSave().
     */
    public ParsedResumeDTO parseResume(MultipartFile file, UUID studentId) throws IOException {
        String text = extractText(file);
        String savedUrl = fileStorageService.storeFile(file, studentId.toString());

        return ParsedResumeDTO.builder()
                .name(extractName(text))
                .email(extractEmail(text))
                .phone(extractPhone(text))
                .skills(extractSkills(text))
                .education(extractEducation(text))
                .projectCount(countSection(text, "project"))
                .internshipCount(countSection(text, "intern"))
                .rawText(text.length() > 500 ? text.substring(0, 500) + "..." : text)
                .resumeUrl(savedUrl)
                .build();
    }

    /**
     * Confirm parsed data → update student profile in DB.
     */
    public void confirmAndSave(UUID studentId, ParsedResumeDTO dto) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (dto.getName() != null && !dto.getName().isBlank()) student.setName(dto.getName());
        if (dto.getPhone() != null && !dto.getPhone().isBlank()) student.setPhone(dto.getPhone());
        if (dto.getSkills() != null && !dto.getSkills().isEmpty()) student.setSkills(dto.getSkills());
        if (dto.getResumeUrl() != null) student.setResumeUrl(dto.getResumeUrl());
        if (dto.getProjectCount() > 0) student.setProjectCount(dto.getProjectCount());
        if (dto.getInternshipCount() > 0) student.setInternshipCount(dto.getInternshipCount());

        // Store raw text for keyword search in matching
        String rawFull = dto.getRawText();
        if (rawFull != null) student.setResumeText(rawFull);

        studentRepository.save(student);
    }

    // ─────────────────────────────────────────────
    // Private extraction helpers
    // ─────────────────────────────────────────────

    private String extractText(MultipartFile file) throws IOException {
        String filename = Objects.requireNonNull(file.getOriginalFilename()).toLowerCase();
        if (filename.endsWith(".pdf")) {
            try (PDDocument doc = Loader.loadPDF(file.getBytes())) {
                return new PDFTextStripper().getText(doc);
            }
        } else if (filename.endsWith(".docx")) {
            try (XWPFDocument doc = new XWPFDocument(file.getInputStream())) {
                return doc.getParagraphs().stream()
                        .map(XWPFParagraph::getText)
                        .collect(Collectors.joining("\n"));
            }
        }
        throw new IllegalArgumentException("Unsupported file type. Upload PDF or DOCX.");
    }

    private String extractEmail(String text) {
        Matcher m = Pattern.compile("[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}").matcher(text);
        return m.find() ? m.group() : "";
    }

    private String extractPhone(String text) {
        Matcher m = Pattern.compile("(\\+91[\\-\\s]?)?[6-9]\\d{9}").matcher(text);
        return m.find() ? m.group() : "";
    }

    private String extractName(String text) {
        // Heuristic: first non-empty line that is all words (no digits/symbols)
        for (String line : text.split("\n")) {
            String trimmed = line.trim();
            if (trimmed.length() > 3 && trimmed.length() < 50
                    && trimmed.matches("[A-Za-z .]+")
                    && !trimmed.toLowerCase().contains("resume")
                    && !trimmed.toLowerCase().contains("curriculum")) {
                return trimmed;
            }
        }
        return "";
    }

    private String extractEducation(String text) {
        String lower = text.toLowerCase();
        Pattern p = Pattern.compile("(b\\.?e|b\\.?tech|m\\.?tech|b\\.?sc|m\\.?sc|mca|bca)[^\\n]{0,80}", Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(lower);
        return m.find() ? m.group().trim() : "";
    }

    private List<String> extractSkills(String text) {
        String lower = text.toLowerCase();
        return KNOWN_SKILLS.stream()
                .filter(skill -> lower.contains(skill))
                .map(s -> Character.toUpperCase(s.charAt(0)) + s.substring(1))
                .distinct()
                .collect(Collectors.toList());
    }

    private int countSection(String text, String keyword) {
        String lower = text.toLowerCase();
        // Count occurrences of the section keyword as a rough proxy
        int idx = lower.indexOf(keyword);
        if (idx < 0) return 0;
        // Count bullet/numbered lines after section heading
        String section = lower.substring(idx, Math.min(idx + 1000, lower.length()));
        long count = Arrays.stream(section.split("\n"))
                .filter(l -> l.trim().startsWith("•") || l.trim().matches("\\d+\\..*") || l.trim().startsWith("-"))
                .count();
        return (int) Math.max(1, Math.min(count, 10));
    }
}
