package com.project.campusExpress.controller;

import com.project.campusExpress.entity.Notification;
import com.project.campusExpress.entity.User;
import com.project.campusExpress.exception.ResourceNotFoundException;
import com.project.campusExpress.repository.NotificationRepository;
import com.project.campusExpress.repository.UserRepository;
import com.project.campusExpress.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private JwtService jwtservice;
    @Autowired
    private UserRepository userRepository;
   @GetMapping
    public List<Notification> getMyNotifications(@RequestHeader("Authorization") String tokenHeader){
       String token= tokenHeader.substring(7);
       String username= jwtservice.extractUsername(token);
       User currentUser = userRepository.findByUsername(username)
               .orElseThrow(()-> new ResourceNotFoundException("User not found"));
       return notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
   }
   @PutMapping("/{id}/ read")
    public Notification markAsRead(@PathVariable Long id){
       Notification notification = notificationRepository.findById(id)
               .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
       notification.setRead(true);
       return notificationRepository.save(notification);
   }

}
