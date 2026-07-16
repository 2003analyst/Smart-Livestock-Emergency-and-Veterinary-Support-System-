package com.smartlivestock.smartlivestockbackend.controller;

import com.smartlivestock.smartlivestockbackend.entity.User;
import com.smartlivestock.smartlivestockbackend.service.AuthService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {

        return authService.register(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) {

        return authService.login(
                user.getEmail(),
                user.getPassword()
        );
    }
}