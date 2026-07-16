package com.smartlivestock.smartlivestockbackend.service;

import com.smartlivestock.smartlivestockbackend.entity.Emergency;
import com.smartlivestock.smartlivestockbackend.entity.Livestock;
import com.smartlivestock.smartlivestockbackend.repository.EmergencyRepository;
import com.smartlivestock.smartlivestockbackend.repository.LivestockRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmergencyService {

    private final EmergencyRepository emergencyRepository;
    private final LivestockRepository livestockRepository;

    public EmergencyService(
            EmergencyRepository emergencyRepository,
            LivestockRepository livestockRepository
    ) {
        this.emergencyRepository = emergencyRepository;
        this.livestockRepository = livestockRepository;
    }

    // Report emergency
    public Emergency reportEmergency(Emergency emergency) {

        Livestock livestock = livestockRepository
                .findById(emergency.getLivestockId())
                .orElseThrow(() ->
                        new RuntimeException("Livestock not found")
                );

        if (!livestock.getOwnerId().equals(
                emergency.getFarmerId()
        )) {
            throw new RuntimeException(
                    "This livestock does not belong to this farmer"
            );
        }

        if (emergency.getSeverity() == null ||
                emergency.getSeverity().isEmpty()) {

            throw new RuntimeException(
                    "Emergency severity is required"
            );
        }

        emergency.setStatus("pending");

        return emergencyRepository.save(emergency);
    }

    // Get all emergencies
    public List<Emergency> getAllEmergencies() {

        return emergencyRepository
                .findAllByOrderByReportedAtDesc();
    }

    // Get emergencies belonging to one farmer
    public List<Emergency> getEmergenciesByFarmer(
            Long farmerId
    ) {

        return emergencyRepository
                .findByFarmerIdOrderByReportedAtDesc(
                        farmerId
                );
    }

    // Get one emergency
    public Emergency getEmergencyById(Long id) {

        return emergencyRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Emergency not found"
                        )
                );
    }

    // Update emergency status
    public Emergency updateStatus(
            Long id,
            String status
    ) {

        Emergency emergency = getEmergencyById(id);

        emergency.setStatus(status);

        return emergencyRepository.save(emergency);
    }

    // Delete emergency
    public void deleteEmergency(Long id) {

        Emergency emergency = getEmergencyById(id);

        emergencyRepository.delete(emergency);
    }
}