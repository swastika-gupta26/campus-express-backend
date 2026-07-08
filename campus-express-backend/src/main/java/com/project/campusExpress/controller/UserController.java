package com.project.campusExpress.controller;

import com.project.campusExpress.dto.request.ProfileUpdateRequest;
import com.project.campusExpress.dto.response.UserResponse;
import com.project.campusExpress.entity.User;
import com.project.campusExpress.exception.ResourceNotFoundException;
import com.project.campusExpress.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;


    @DeleteMapping("/admin/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return "User with ID " + id + " has been successfully deleted by Admin!";
        } else {
            return "User not found!";
        }
    }
    @GetMapping("/my-profile")
    public ResponseEntity<?> getUserProfile(Principal principal) {
        String username = principal.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @PutMapping("/my-profile")
    public ResponseEntity<?> updateUserProfile(Principal principal, @RequestBody ProfileUpdateRequest request){
        String username=principal.getName();
        User user=userRepository.findByUsername(username)
                .orElseThrow(()->new ResourceNotFoundException("User not found!"));

        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setHostelName(request.getHostelName());
        user.setCourse(request.getCourse());
        user.setYear(request.getYear());

        userRepository.save(user);
        return ResponseEntity.ok(UserResponse.from(user));
    }
    @PutMapping("/become-producer")
    public ResponseEntity<?> becomeProducer (Principal principal){
        String username=principal.getName();
        User user=userRepository.findByUsername(username)
                .orElseThrow(()->new ResourceNotFoundException("User not found!"));

        if(user.isProducer()){
            return ResponseEntity.ok(java.util.Map.of("newlyGranted", false));
        }
        user.setProducer(true);
        userRepository.save(user);
        return ResponseEntity.ok(java.util.Map.of("newlyGranted", true));
    }
}
