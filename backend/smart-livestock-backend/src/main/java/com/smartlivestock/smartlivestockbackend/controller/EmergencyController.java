package com.smartlivestock.smartlivestockbackend.controller;

import com.smartlivestock.smartlivestockbackend.entity.Emergency;
import com.smartlivestock.smartlivestockbackend.service.EmergencyService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/emergencies")
@CrossOrigin(origins = "*")
public class EmergencyController {

    private final EmergencyService emergencyService;

    public EmergencyController(
            EmergencyService emergencyService
    ) {
        this.emergencyService = emergencyService;
    }

    // Report emergency
    @PostMapping
    public Emergency reportEmergency(
            @RequestBody Emergency emergency
    ) {

        return emergencyService.reportEmergency(
                emergency
        );
    }

    // Get all emergencies
    @GetMapping
    public List<Emergency> getAllEmergencies() {

        return emergencyService.getAllEmergencies();
    }

    // Get emergencies belonging to one farmer
    @GetMapping("/farmer/{farmerId}")
    public List<Emergency> getEmergenciesByFarmer(
            @PathVariable Long farmerId
    ) {

        return emergencyService
                .getEmergenciesByFarmer(farmerId);
    }

    // Get one emergency
    @GetMapping("/{id}")
    public Emergency getEmergencyById(
            @PathVariable Long id
    ) {

        return emergencyService
                .getEmergencyById(id);
    }

    // Update status
    @PutMapping("/{id}/status")
    public Emergency updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request
    ) {

        String status = request.get("status");

        return emergencyService.updateStatus(
                id,
                status
        );
    }

    // Delete emergency
    @DeleteMapping("/{id}")
    public String deleteEmergency(
            @PathVariable Long id
    ) {

        emergencyService.deleteEmergency(id);

        return "Emergency deleted successfully";
    }
}