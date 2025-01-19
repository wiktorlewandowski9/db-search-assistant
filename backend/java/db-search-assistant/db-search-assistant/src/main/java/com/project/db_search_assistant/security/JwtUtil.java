package com.project.db_search_assistant.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    @Value("${SECRET_KEY}")
    private String secretKey;

    // Generowanie tokena JWT
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 90000)) // 15 minut
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    // Weryfikacja tokena JWT
    public String validateToken(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject();
    }
}
