package com.project.campusExpress.service;

import com.project.campusExpress.entity.User;
import com.project.campusExpress.repository.UserRepository; // Apne repo ka sahi package dekh lena
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service // <-- Yeh lagana bohot zaroori hai, taaki Spring iska bean bana sake
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository; // Jo database se user nikaalega

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<User> user = userRepository.findByUsername(username);


        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found with name: " + username);
        }
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.get().getRole()));
        if (user.get().isProducer()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_PRODUCER"));
        }


        return new org.springframework.security.core.userdetails.User(
                user.get().getUsername(),
                user.get().getPassword(),
                authorities
        );
    }
}