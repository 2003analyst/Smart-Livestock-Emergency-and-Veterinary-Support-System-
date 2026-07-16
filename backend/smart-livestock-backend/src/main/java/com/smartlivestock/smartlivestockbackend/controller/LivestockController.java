package com.smartlivestock.smartlivestockbackend.controller;

import com.smartlivestock.smartlivestockbackend.entity.Livestock;
import com.smartlivestock.smartlivestockbackend.service.LivestockService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/livestock")
@CrossOrigin(origins = "*")
public class LivestockController {

    private final LivestockService livestockService;

    public LivestockController(
            LivestockService livestockService
    ) {
        this.livestockService = livestockService;
    }

    // Add livestock
    @PostMapping
    public Livestock addLivestock(
            @RequestBody Livestock livestock
    ) {

        return livestockService.addLivestock(livestock);
    }

    // Get all livestock
    @GetMapping
    public List<Livestock> getAllLivestock() {

        return livestockService.getAllLivestock();
    }

    // Get livestock belonging to one farmer
    @GetMapping("/owner/{ownerId}")
    public List<Livestock> getLivestockByOwner(
            @PathVariable Long ownerId
    ) {

        return livestockService.getLivestockByOwner(ownerId);
    }

    // Get one livestock
    @GetMapping("/{id}")
    public Livestock getLivestockById(
            @PathVariable Long id
    ) {

        return livestockService.getLivestockById(id);
    }

    // Update livestock
    @PutMapping("/{id}")
    public Livestock updateLivestock(
            @PathVariable Long id,
            @RequestBody Livestock livestock
    ) {

        return livestockService.updateLivestock(id, livestock);
    }

    // Delete livestock
    @DeleteMapping("/{id}")
    public String deleteLivestock(
            @PathVariable Long id
    ) {

        livestockService.deleteLivestock(id);

        return "Livestock deleted successfully";
    }
}