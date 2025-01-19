package com.fintrack.fintrack.repository;

import com.fintrack.fintrackmodel.Entity.Users.Records;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecordRepository extends JpaRepository<Records,Long> {
}
