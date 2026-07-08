package com.project.campusExpress.controller;

import com.project.campusExpress.entity.User;
import com.project.campusExpress.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private com.project.campusExpress.repository.UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/auth/login")
    public String login(@RequestParam("username") String username, @RequestParam("password") String password) {
        try {

            Optional<User> user = userRepository.findByUsername(username);


            if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
                return jwtService.generateToken(username);
            } else {
                return "Invalid Username or password!";
            }
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    @GetMapping("/consumer/profile")
    public String getProfile() {
        return "Welcome to Campus Express! This is your secured profile data.";
    }

    @PostMapping("/auth/register")
    public String registerUser(@RequestBody User user) {
        try {
            Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
            if (existingUser.isPresent()) {
                return "Username is already taken";
            }
            user.setRole("ROLE_CONSUMER");

            String encryptedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encryptedPassword);

            userRepository.save(user);
            return "User registered successfully";
        } catch (Exception e) {
            return "Registration failed!";
        }
    }


}
