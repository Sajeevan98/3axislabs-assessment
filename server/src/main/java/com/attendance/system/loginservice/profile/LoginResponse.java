package com.attendance.system.loginservice.profile;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@Data
public class LoginResponse {
    private String jwtToken;
    private String username;
    private List<String> roles;
}
