package com.pat.repository;

import com.pat.entity.Drive;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface DriveRepository extends JpaRepository<Drive, UUID> {
}
