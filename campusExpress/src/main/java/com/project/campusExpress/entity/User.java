package com.project.campusExpress.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Column(unique = true, nullable = false)
    private String username;
    private String address;
    private String hostelName;
    private String phoneNumber;
    @Column(nullable = false)
    private String password;
    private String role;

    public User() {
    }

    public User(String name, String address, String hostelName, String phoneNumber, String password) {
        this.name = name;
        this.hostelName = hostelName;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.password=password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }


    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }


    public String getHostelName() {
        return hostelName;
    }

    public void setHostelName(String hostelName) {
        this.hostelName = hostelName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password =password;
    }

    public String getRole(){
        return role;
    }
    public void setRole(String role){
        this.role=role;
    }
}


