package com.attendance.system.loginservice.util;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtils jwtUtils;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getServletPath();

        // skip JWT validation for login and public URLs...
        if ("/login".equals(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        try{
            String jwt = parseJWT(request);
            if(jwt != null && jwtUtils.validateJwtToken(jwt)){
                String userName = jwtUtils.getUsernameFromToken(jwt);

                UserDetails userDetails = userDetailsService.loadUserByUsername(userName);

                UsernamePasswordAuthenticationToken uNamePassAuthToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                logger.debug("Roles from JWT: {}", userDetails.getAuthorities());

                uNamePassAuthToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(uNamePassAuthToken);
            }
        }catch (Exception ex){
            logger.error("Could not set user-authentication: {} ", ex.getMessage());
        }
        filterChain.doFilter(request,response); // continue the filter as usual...

    }

    private String parseJWT(HttpServletRequest request) {
        String jwt = jwtUtils.getJwtFromHeader(request);    // call the method from JwtUtils.java class
        logger.debug("AuthToken: {}", jwt);
        return jwt;
    }
}
