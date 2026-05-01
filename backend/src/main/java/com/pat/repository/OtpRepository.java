package com.pat.repository;

import com.pat.entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface OtpRepository extends JpaRepository<OtpToken, UUID> {
    Optional<OtpToken> findByEmailAndCode(String email, String code);
    void deleteByEmail(String email);
}
