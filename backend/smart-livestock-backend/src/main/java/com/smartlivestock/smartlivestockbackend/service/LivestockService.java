package com.smartlivestock.smartlivestockbackend.service;

import com.smartlivestock.smartlivestockbackend.entity.Livestock;
import com.smartlivestock.smartlivestockbackend.repository.LivestockRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LivestockService {

    private final LivestockRepository livestockRepository;

    public LivestockService(
            LivestockRepository livestockRepository
    ) {
        this.livestockRepository = livestockRepository;
    }

    // Save livestock
    public Livestock addLivestock(Livestock livestock) {

        if (livestock.getHealthStatus() == null ||
                livestock.getHealthStatus().isEmpty()) {

            livestock.setHealthStatus("Healthy");
        }

        return livestockRepository.save(livestock);
    }

    // Get all livestock
    public List<Livestock> getAllLivestock() {

        return livestockRepository.findAll();
    }

    // Get livestock belonging to one farmer
    public List<Livestock> getLivestockByOwner(Long ownerId) {

        return livestockRepository.findByOwnerId(ownerId);
    }

    // Get one livestock
    public Livestock getLivestockById(Long id) {

        return livestockRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Livestock not found")
                );
    }

    // Update livestock
    public Livestock updateLivestock(
            Long id,
            Livestock updatedLivestock
    ) {

        Livestock existingLivestock = getLivestockById(id);

        existingLivestock.setAnimalType(
                updatedLivestock.getAnimalType()
        );

        existingLivestock.setBreed(
                updatedLivestock.getBreed()
        );

        existingLivestock.setName(
                updatedLivestock.getName()
        );

        existingLivestock.setAge(
                updatedLivestock.getAge()
        );

        existingLivestock.setWeight(
                updatedLivestock.getWeight()
        );

        existingLivestock.setHealthStatus(
                updatedLivestock.getHealthStatus()
        );

        return livestockRepository.save(existingLivestock);
    }

    // Delete livestock
    public void deleteLivestock(Long id) {

        Livestock livestock = getLivestockById(id);

        livestockRepository.delete(livestock);
    }
}