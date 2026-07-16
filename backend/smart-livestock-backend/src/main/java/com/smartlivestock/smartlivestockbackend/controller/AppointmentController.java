package com.smartlivestock.smartlivestockbackend.controller;

import com.smartlivestock.smartlivestockbackend.entity.Appointment;
import com.smartlivestock.smartlivestockbackend.service.AppointmentService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(
            AppointmentService appointmentService
    ) {
        this.appointmentService = appointmentService;
    }

    // Farmer books appointment
    @PostMapping
    public Appointment bookAppointment(
            @RequestBody Appointment appointment
    ) {

        return appointmentService
                .bookAppointment(appointment);
    }

    // Get all appointments
    @GetMapping
    public List<Appointment> getAllAppointments() {

        return appointmentService
                .getAllAppointments();
    }

    // Get farmer appointments
    @GetMapping("/farmer/{farmerId}")
    public List<Appointment> getFarmerAppointments(
            @PathVariable Long farmerId
    ) {

        return appointmentService
                .getFarmerAppointments(farmerId);
    }

    // Get doctor appointments
    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> getDoctorAppointments(
            @PathVariable Long doctorId
    ) {

        return appointmentService
                .getDoctorAppointments(doctorId);
    }

    // Update appointment status
    @PutMapping("/{appointmentId}/status")
    public Appointment updateAppointmentStatus(
            @PathVariable Long appointmentId,
            @RequestBody Map<String, Object> request
    ) {

        Long doctorId = Long.valueOf(
                request.get("doctor_id").toString()
        );

        String status =
                request.get("status").toString();

        return appointmentService
                .updateAppointmentStatus(
                        appointmentId,
                        doctorId,
                        status
                );
    }

    // Delete appointment
    @DeleteMapping("/{id}")
    public String deleteAppointment(
            @PathVariable Long id
    ) {

        appointmentService.deleteAppointment(id);

        return "Appointment deleted successfully";
    }
}