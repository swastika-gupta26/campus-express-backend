package com.project.campusExpress.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtService {
    @Value("${jwt.secret}")
    private String SECRET_KEY;

     public String generateToken(String username){
        return Jwts.builder()
                 .setSubject(username)
                 .setIssuedAt(new Date(System.currentTimeMillis()))
                 .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 ghante ki validity
                 .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                 .compact();
    }
    public String extractUsername(String token){
         return Jwts.parserBuilder()
                 .setSigningKey(SECRET_KEY)
                 .build()
                 .parseClaimsJws(token)
                 .getBody()
                 .getSubject();
    }
}
