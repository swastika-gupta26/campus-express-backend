package com.project.campusExpress.dto.response;

import com.project.campusExpress.entity.User;

import java.time.LocalDate;

public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String phoneNumber;
    private String hostelName;
    private String gender;
    private LocalDate dob;
    private String course;
    private String year;
    private boolean isProducer;

    public static UserResponse from(User user){
        UserResponse dto=new UserResponse();
        dto.id=user.getId();
        dto.username = user.getUsername();
        dto.email = user.getEmail();
        dto.phoneNumber = user.getPhoneNumber();
        dto.hostelName = user.getHostelName();
        dto.gender = user.getGender();
        dto.dob = user.getDob();
        dto.course = user.getCourse();
        dto.year = user.getYear();
        dto.isProducer = user.isProducer();
        return dto;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getHostelName() { return hostelName; }
    public String getGender() { return gender; }
    public LocalDate getDob() { return dob; }
    public String getCourse() { return course; }
    public String getYear() { return year; }
    public boolean isProducer() { return isProducer; }

}
