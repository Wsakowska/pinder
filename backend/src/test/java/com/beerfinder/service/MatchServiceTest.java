package com.beerfinder.service;

import com.beerfinder.dto.MatchResponse;
import com.beerfinder.entity.Match;
import com.beerfinder.entity.User;
import com.beerfinder.exception.ResourceNotFoundException;
import com.beerfinder.repository.MatchRepository;
import com.beerfinder.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MatchServiceTest {

    @Mock
    private MatchRepository matchRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private MatchService matchService;

    private User user1;
    private User user2;

    @BeforeEach
    void setUp() {
        user1 = new User();
        user1.setId(1L);
        user1.setEmail("user1@test.com");

        user2 = new User();
        user2.setId(2L);
        user2.setEmail("user2@test.com");

        // Mockowanie SecurityContext, aby getCurrentUser() działało
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    @DisplayName("Should create match with user1 having smaller ID")
    void shouldCreateMatchWithOrderedIds() {
        // Given
        when(matchRepository.existsByUser1AndUser2(any(), any())).thenReturn(false);
        when(matchRepository.save(any(Match.class))).thenAnswer(i -> i.getArguments()[0]);

        // When
        Match createdMatch = matchService.createMatch(user2, user1); // Odwrócona kolejność w argumencie

        // Then
        assertThat(createdMatch.getUser1().getId()).isEqualTo(1L); // user1 powinien być pierwszy (ID:1 < ID:2)
        assertThat(createdMatch.getUser2().getId()).isEqualTo(2L);
        verify(matchRepository).save(any(Match.class));
    }

    @Test
    @DisplayName("Should throw exception when match already exists")
    void shouldThrowExceptionWhenMatchExists() {
        // Given
        when(matchRepository.existsByUser1AndUser2(user1, user2)).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> matchService.createMatch(user1, user2))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Match already exists between these users");
    }

    @Test
    @DisplayName("Should return matches for current user")
    void shouldReturnMyMatches() {
        // Given
        mockSecurityContext("user1@test.com");
        when(userRepository.findByEmail("user1@test.com")).thenReturn(Optional.of(user1));

        Match match = new Match();
        match.setUser1(user1);
        match.setUser2(user2);
        match.setIsActive(true);

        when(matchRepository.findActiveMatchesByUser(user1)).thenReturn(List.of(match));

        // When
        List<MatchResponse> results = matchService.getMyMatches();

        // Then
        assertThat(results).hasSize(1);
        verify(matchRepository).findActiveMatchesByUser(user1);
    }

    @Test
    @DisplayName("Should throw exception when accessing match of other users")
    void shouldProtectMatchAccess() {
        // Given
        mockSecurityContext("user1@test.com");
        when(userRepository.findByEmail("user1@test.com")).thenReturn(Optional.of(user1));

        User user3 = new User(); user3.setId(3L);
        User user4 = new User(); user4.setId(4L);

        Match otherMatch = new Match();
        otherMatch.setUser1(user3);
        otherMatch.setUser2(user4);

        when(matchRepository.findById(10L)).thenReturn(Optional.of(otherMatch));

        // When & Then
        assertThatThrownBy(() -> matchService.getMatchById(10L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    private void mockSecurityContext(String email) {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(email);
    }
}