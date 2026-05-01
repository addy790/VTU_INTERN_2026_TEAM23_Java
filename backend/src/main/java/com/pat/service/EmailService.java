package com.pat.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("Your Placement Compass OTP");

            String htmlMessage = "<html>" +
                    "<body style='font-family: Arial, sans-serif;'>" +
                    "<h2>Welcome to Placement Compass!</h2>" +
                    "<p>Your one-time password (OTP) for registration is:</p>" +
                    "<h1 style='color: #800000; font-size: 32px; letter-spacing: 5px;'>" + otp + "</h1>" +
                    "<p>This code will expire in 5 minutes.</p>" +
                    "<hr/>" +
                    "<p style='font-size: 12px; color: #666;'>If you did not request this, please ignore this email.</p>" +
                    "</body>" +
                    "</html>";

            helper.setText(htmlMessage, true);
            mailSender.send(message);
            System.out.println("Email sent successfully to: " + to);
        } catch (MessagingException e) {
            System.out.println("Failed to send email to " + to + ": " + e.getMessage());
            // We don't throw exception here to avoid breaking the registration flow 
            // if mail server is not configured yet.
        }
    }
}
