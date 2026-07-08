package com.project.campusExpress.config;

import com.project.campusExpress.config.JwtAuthFilter;
import com.project.campusExpress.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {
        return http

                .cors(cors -> cors.configurationSource(request -> {
                    org.springframework.web.cors.CorsConfiguration config = new org.springframework.web.cors.CorsConfiguration();
                    config.setAllowedOrigins(java.util.List.of("http://localhost:5173"));
                    config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(java.util.List.of("*"));
                    config.setAllowCredentials(true);
                    return config;
                }))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**").hasAnyRole("CONSUMER","PRODUCER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasAnyRole("PRODUCER")
                        .requestMatchers(HttpMethod.POST, "/api/orders/product/**").hasRole("CONSUMER")
                        .requestMatchers("/api/user/my-profile").hasAnyRole("CONSUMER","PRODUCER", "ADMIN")
                        .requestMatchers("/api/user/admin/delete/{id}").hasRole("ADMIN")
                        .requestMatchers("/api/user/become-producer").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/orders/my-orders").hasAnyRole("CONSUMER","PRODUCER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/orders/my-sales").hasAnyRole("PRODUCER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/orders").hasAnyRole("PRODUCER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/orders/*/cancel").hasAnyRole("CONSUMER", "PRODUCER", "ADMIN")
                        .requestMatchers("/api/orders/{orderId}/status").hasAnyRole("PRODUCER")
                        .requestMatchers(HttpMethod.GET, "/api/orders/hostel/**").hasAnyRole("PRODUCER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasAnyRole("PRODUCER", "ADMIN")
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}