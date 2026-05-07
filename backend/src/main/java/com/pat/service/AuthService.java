package com.pat.service;

import com.pat.dto.*;
import com.pat.entity.*;
import com.pat.repository.*;
import com.pat.security.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private OtpService otpService;

    @Transactional
    public String registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .name(request.getName())
                .role(Role.valueOf(request.getRole().toUpperCase()))
                .verified(false)
                .build();

        User savedUser = userRepository.save(user);

        if (user.getRole() == Role.STUDENT) {
            Student student = Student.builder()
                    .user(savedUser)
                    .name(request.getName())
                    .branch(request.getBranch())
                    .cgpa(request.getCgpa())
                    .skills(request.getSkills())
                    .verified(false)
                    .build();
            studentRepository.save(student);
        }

        return otpService.generateOtp(user.getEmail());
    }

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername()).get();

        if (!user.isVerified()) {
            throw new RuntimeException("Error: Account not verified. Please verify OTP.");
        }

        return new JwtResponse(jwt,
                userDetails.getId().toString(),
                userDetails.getUsername(),
                user.getName(),
                user.getRole().name());
    }

    @Transactional
    public void verifyAccount(OtpVerifyRequest request) {
        if (otpService.verifyOtp(request.getEmail(), request.getCode())) {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setVerified(true);
            userRepository.save(user);
        } else {
            throw new RuntimeException("Invalid or expired OTP");
        }
    }

    @Transactional
    public void resendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.isVerified()) {
            throw new RuntimeException("Account is already verified.");
        }
        otpService.generateOtp(email);
    }

    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        otpService.generateOtp(email);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (otpService.verifyOtp(request.getEmail(), request.getCode())) {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setPassword(encoder.encode(request.getNewPassword()));
            userRepository.save(user);
            otpService.deleteOtp(request.getEmail()); // Cleanup OTP after success
        } else {
            throw new RuntimeException("Invalid or expired OTP");
        }
    }
}
