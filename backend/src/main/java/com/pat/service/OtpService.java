package com.pat.service;

import com.pat.entity.OtpToken;
import com.pat.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {
    @Autowired
    private OtpRepository otpRepository;

    @Value("${pat.app.otpExpirationMs}")
    private long otpExpirationMs;

    @Autowired
    private EmailService emailService;

    @Transactional
    public String generateOtp(String email) {
        otpRepository.deleteByEmail(email);
        
        String code = String.format("%06d", new Random().nextInt(999999));
        OtpToken token = OtpToken.builder()
                .email(email)
                .code(code)
                .expiryTime(LocalDateTime.now().plusNanos(otpExpirationMs * 1_000_000))
                .build();
        
        otpRepository.save(token);
        
        // SEND REAL EMAIL
        emailService.sendOtpEmail(email, code);
        
        return code;
    }

    public boolean verifyOtp(String email, String code) {
        return otpRepository.findByEmailAndCode(email, code)
                .map(token -> token.getExpiryTime().isAfter(LocalDateTime.now()))
                .orElse(false);
    }

    @Transactional
    public void deleteOtp(String email) {
        otpRepository.deleteByEmail(email);
    }
}
