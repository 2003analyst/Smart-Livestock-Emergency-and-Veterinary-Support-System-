package com.smartlivestock.smartlivestockbackend.repository;

import com.smartlivestock.smartlivestockbackend.entity.Emergency;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmergencyRepository
        extends JpaRepository<Emergency, Long> {

    List<Emergency> findByFarmerIdOrderByReportedAtDesc(
            Long farmerId
    );

    List<Emergency> findAllByOrderByReportedAtDesc();
}