package com.smartlivestock.smartlivestockbackend.repository;

import com.smartlivestock.smartlivestockbackend.entity.Livestock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LivestockRepository
        extends JpaRepository<Livestock, Long> {

    List<Livestock> findByOwnerId(Long ownerId);
}