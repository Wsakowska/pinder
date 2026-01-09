package com.beerfinder.service;

import com.beerfinder.dto.AuthResponse;
import com.beerfinder.dto.LoginRequest;
import com.beerfinder.dto.RegisterRequest;
import com.beerfinder.entity.User;
import com.beerfinder.exception.BadRequestException;
import com.beerfinder.repository.UserRepository;
import com.beerfinder.security.JwtUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("Should register user successfully and create profile")
    void shouldRegisterUserSuccessfully() {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@user.com");
        request.setPassword("plainPassword");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setEmail(request.getEmail());

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtUtil.generateToken(savedUser.getEmail(), savedUser.getId())).thenReturn("mock-jwt-token");

        // When
        AuthResponse response = authService.register(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("mock-jwt-token");
        assertThat(response.getEmail()).isEqualTo(request.getEmail());

        // Weryfikujemy czy profil został przypisany do usera przed save
        verify(userRepository).save(argThat(user ->
                user.getProfile() != null && user.getProfile().getUser() == user
        ));
    }

    @Test
    @DisplayName("Should throw BadRequestException when email exists")
    void shouldThrowExceptionWhenEmailExists() {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setEmail("exists@user.com");
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Email already exists");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should login successfully and return token")
    void shouldLoginSuccessfully() {
        // Given
        LoginRequest request = new LoginRequest();
        request.setEmail("user@test.com");
        request.setPassword("password");

        User user = new User();
        user.setId(1L);
        user.setEmail(request.getEmail());

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken(user.getEmail(), user.getId())).thenReturn("login-token");

        // When
        AuthResponse response = authService.login(request);

        // Then
        assertThat(response.getToken()).isEqualTo("login-token");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }
}