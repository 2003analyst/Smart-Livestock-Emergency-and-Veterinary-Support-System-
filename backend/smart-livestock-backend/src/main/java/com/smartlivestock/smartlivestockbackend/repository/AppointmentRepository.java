package com.smartlivestock.smartlivestockbackend.repository;

import com.smartlivestock.smartlivestockbackend.entity.Appointment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    List<Appointment> findByFarmerIdOrderByDateDesc(
            Long farmerId
    );

    List<Appointment> findByDoctorIdOrderByDateDesc(
            Long doctorId
    );

    List<Appointment> findAllByOrderByDateDesc();
}