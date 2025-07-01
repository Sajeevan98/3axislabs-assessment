package com.attendance.system.loginservice.profile;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
