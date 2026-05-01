package com.pat.service;

import com.pat.entity.Student;
import com.pat.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(UUID id) {
        return studentRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student updateStudent(UUID id, Student studentDetails) {
        Student student = getStudentById(id);
        student.setName(studentDetails.getName());
        student.setBranch(studentDetails.getBranch());
        student.setCgpa(studentDetails.getCgpa());
        student.setSkills(studentDetails.getSkills());
        student.setResumeUrl(studentDetails.getResumeUrl());
        return studentRepository.save(student);
    }

    public List<Student> getUnverifiedStudents() {
        return studentRepository.findByVerifiedFalse();
    }

    public void verifyStudent(UUID id) {
        Student student = getStudentById(id);
        student.setVerified(true);
        studentRepository.save(student);
    }
}
