package com.smartlivestock.smartlivestockbackend.service;

import com.smartlivestock.smartlivestockbackend.entity.Appointment;
import com.smartlivestock.smartlivestockbackend.entity.Livestock;
import com.smartlivestock.smartlivestockbackend.entity.User;
import com.smartlivestock.smartlivestockbackend.repository.AppointmentRepository;
import com.smartlivestock.smartlivestockbackend.repository.LivestockRepository;
import com.smartlivestock.smartlivestockbackend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final LivestockRepository livestockRepository;
    private final UserRepository userRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            LivestockRepository livestockRepository,
            UserRepository userRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.livestockRepository = livestockRepository;
        this.userRepository = userRepository;
    }

    // Farmer books appointment
    public Appointment bookAppointment(
            Appointment appointment
    ) {

        if (appointment.getLivestockId() != null) {

            Livestock livestock = livestockRepository
                    .findById(appointment.getLivestockId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Livestock not found"
                            )
                    );

            if (!livestock.getOwnerId().equals(
                    appointment.getFarmerId()
            )) {
                throw new RuntimeException(
                        "This livestock does not belong to this farmer"
                );
            }
        }

        appointment.setStatus("pending");

        return appointmentRepository.save(appointment);
    }

    // Get all appointments
    public List<Appointment> getAllAppointments() {

        return appointmentRepository
                .findAllByOrderByDateDesc();
    }

    // Get appointments for farmer
    public List<Appointment> getFarmerAppointments(
            Long farmerId
    ) {

        return appointmentRepository
                .findByFarmerIdOrderByDateDesc(farmerId);
    }

    // Get appointments for doctor
    public List<Appointment> getDoctorAppointments(
            Long doctorId
    ) {

        return appointmentRepository
                .findByDoctorIdOrderByDateDesc(doctorId);
    }

    // Get one appointment
    public Appointment getAppointmentById(Long id) {

        return appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Appointment not found"
                        )
                );
    }

    // Doctor changes appointment status
    public Appointment updateAppointmentStatus(
            Long appointmentId,
            Long doctorId,
            String status
    ) {

        Appointment appointment =
                getAppointmentById(appointmentId);

        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found"
                        )
                );

        if (!"DOCTOR".equals(doctor.getRole())) {
            throw new RuntimeException(
                    "Selected user is not a doctor"
            );
        }

        appointment.setDoctorId(doctorId);
        appointment.setDoctorName(doctor.getFullName());
        appointment.setStatus(status);

        return appointmentRepository.save(appointment);
    }

    // Delete appointment
    public void deleteAppointment(Long id) {

        Appointment appointment = getAppointmentById(id);

        appointmentRepository.delete(appointment);
    }
}