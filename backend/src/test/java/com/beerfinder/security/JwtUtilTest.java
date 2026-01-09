package com.beerfinder.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    // Klucz musi mieć co najmniej 32 znaki dla algorytmu HS256
    private final String secret = "bardzosekretnykluczktorymaszynajmniej32znaki";
    private final Long expiration = 3600000L; // 1 godzina

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        // Ręczne wstrzyknięcie wartości, które normalnie pobiera @Value
        ReflectionTestUtils.setField(jwtUtil, "secret", secret);
        ReflectionTestUtils.setField(jwtUtil, "expiration", expiration);
    }

    @Test
    @DisplayName("Should generate a valid JWT token")
    void shouldGenerateToken() {
        // Given
        String email = "test@example.com";
        Long userId = 123L;

        // When
        String token = jwtUtil.generateToken(email, userId);

        // Then
        assertThat(token).isNotBlank();
        assertThat(jwtUtil.extractEmail(token)).isEqualTo(email);
        assertThat(jwtUtil.extractUserId(token)).isEqualTo(userId);
    }

    @Test
    @DisplayName("Should validate correct token")
    void shouldValidateCorrectToken() {
        // Given
        String token = jwtUtil.generateToken("user@test.com", 1L);

        // When
        Boolean isValid = jwtUtil.validateToken(token);

        // Then
        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("Should return false for invalid token")
    void shouldReturnFalseForInvalidToken() {
        // Given
        String invalidToken = "this.is.not.a.valid.token";

        // When
        Boolean isValid = jwtUtil.validateToken(invalidToken);

        // Then
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("Should extract expiration date")
    void shouldExtractExpirationDate() {
        // Given
        String token = jwtUtil.generateToken("user@test.com", 1L);

        // When
        Date expirationDate = jwtUtil.extractExpiration(token);

        // Then
        assertThat(expirationDate).isAfter(new Date());
    }

    @Test
    @DisplayName("Should return false for expired token")
    void shouldReturnFalseForExpiredToken() {
        // Given: ustawiamy bardzo krótki czas wygaśnięcia (np. ujemny)
        ReflectionTestUtils.setField(jwtUtil, "expiration", -1000L);
        String expiredToken = jwtUtil.generateToken("user@test.com", 1L);

        // When
        Boolean isValid = jwtUtil.validateToken(expiredToken);

        // Then
        assertThat(isValid).isFalse();
    }
}