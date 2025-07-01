package com.attendance.system.loginservice.controller;

import com.attendance.system.loginservice.profile.LoginRequest;
import com.attendance.system.loginservice.profile.LoginResponse;
import com.attendance.system.loginservice.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/attendance-system")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin-profile")
    public String helloAdmin() {
        return "Hello, Admin";
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user-profile")
    public String helloUser() {
        return "Hello, User";
    }


    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication;

        try {
            authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        } catch (AuthenticationException ex) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", "Bas Credentials");
            map.put("status", false);
            return new ResponseEntity<Object>(map, HttpStatus.NOT_FOUND);
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwtToken = jwtUtils.generateTokenFromUsername(userDetails);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        LoginResponse loginResponse = new LoginResponse(jwtToken, userDetails.getUsername(), roles);
        return ResponseEntity.ok(loginResponse);
    }
}
