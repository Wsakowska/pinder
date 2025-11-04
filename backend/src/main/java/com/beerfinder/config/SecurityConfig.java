package com.beerfinder.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF for now (helpful for testing APIs)
                .csrf(csrf -> csrf.disable())

                // Define which endpoints are open vs. protected
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/swagger-ui/**", "/api-docs/**").permitAll()  // Swagger
                        .requestMatchers("/actuator/**").permitAll()                    // Actuator
                        .anyRequest().permitAll()                                       // all others (for now)
                )

                // Optional: disable login form & HTTP basic popup
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
