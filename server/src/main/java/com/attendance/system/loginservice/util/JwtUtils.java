package com.attendance.system.loginservice.util;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    @Value("${spring.jwt.jwtSecretKey}")
    private String jwtSecret;

    @Value("${spring.jwt.jwtExpirationTime}")
    private int jwtExpirationTime;

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    public String getJwtFromHeader(HttpServletRequest httpServletRequest){

        String bearerToken = httpServletRequest.getHeader("Authorization");
        if(bearerToken != null && bearerToken.startsWith("Bearer")){
            return bearerToken.substring(7);
        }
        return null;
    }

    public String generateTokenFromUsername(UserDetails userDetails){

        String userName = userDetails.getUsername();
        return Jwts.builder()
                .subject(userName)
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirationTime))
                .signWith(Key())
                .compact();
    }

    private Key Key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String getUsernameFromToken(String token){
        return Jwts.parser()
                .verifyWith((SecretKey) Key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateJwtToken(String authToken){
        try{
            System.out.print("Validate Token");
            Jwts.parser()
                    .verifyWith((SecretKey) Key())
                    .build()
                    .parseSignedClaims(authToken);
            return true;
        }catch ( MalformedJwtException ex){
            logger.error("Invalid JWT Token: {}", ex.getMessage());
        }catch ( ExpiredJwtException ex){
            logger.error("JWT Token is Expired: {}", ex.getMessage());
        }catch ( UnsupportedJwtException ex){
            logger.error("JWT Token is Unsupported: {}", ex.getMessage());
        }catch ( IllegalArgumentException ex){
            logger.error("JWT Claims string is empty: {}", ex.getMessage());
        }
        return false;
    }

}
