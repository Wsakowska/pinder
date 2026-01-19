package com.beerfinder.service;

import com.beerfinder.dto.SwipeRequest;
import com.beerfinder.dto.SwipeResponse;
import com.beerfinder.entity.Match;
import com.beerfinder.entity.Swipe;
import com.beerfinder.entity.SwipeAction;
import com.beerfinder.entity.User;
import com.beerfinder.exception.BadRequestException;
import com.beerfinder.repository.SwipeRepository;
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
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SwipeServiceTest {

    @Mock
    private SwipeRepository swipeRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MatchService matchService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private SwipeService swipeService;

    private User currentUser;
    private User otherUser;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
        SecurityContextHolder.setContext(securityContext);

        currentUser = new User();
        currentUser.setId(1L);
        currentUser.setEmail("me@test.com");

        otherUser = new User();
        otherUser.setId(2L);
        otherUser.setEmail("other@test.com");
    }

    private void mockAuth() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(currentUser.getEmail());
        when(userRepository.findByEmail(currentUser.getEmail())).thenReturn(Optional.of(currentUser));
    }

    @Test
    @DisplayName("Should create a match when mutual LIKE exists")
    void shouldCreateMatchOnMutualLike() {
        // Given
        mockAuth();
        SwipeRequest request = new SwipeRequest();
        request.setSwipedUserId(2L);
        request.setAction(SwipeAction.LIKE);

        when(userRepository.findById(2L)).thenReturn(Optional.of(otherUser));
        when(swipeRepository.existsBySwiperAndSwiped(currentUser, otherUser)).thenReturn(false);
        when(swipeRepository.save(any(Swipe.class))).thenAnswer(i -> i.getArguments()[0]);

        Swipe reverseSwipe = new Swipe();
        when(swipeRepository.findBySwiperAndSwipedAndAction(otherUser, currentUser, SwipeAction.LIKE))
                .thenReturn(Optional.of(reverseSwipe));

        Match mockMatch = new Match();
        mockMatch.setId(100L);
        when(matchService.createMatch(currentUser, otherUser)).thenReturn(mockMatch);

        // When
        SwipeResponse response = swipeService.swipe(request);

        // Then
        // Zmieniono na getIsMatch() - najczęstsza nazwa w DTO gdy pole to isMatch
        assertThat(response.getIsMatch()).isTrue();
        assertThat(response.getMatchId()).isEqualTo(100L);
        verify(matchService).createMatch(currentUser, otherUser);
    }

    @Test
    @DisplayName("Should only record swipe when there is no mutual LIKE")
    void shouldRecordSwipeWithoutMatch() {
        // Given
        mockAuth();
        SwipeRequest request = new SwipeRequest();
        request.setSwipedUserId(2L);
        request.setAction(SwipeAction.LIKE);

        when(userRepository.findById(2L)).thenReturn(Optional.of(otherUser));
        when(swipeRepository.findBySwiperAndSwipedAndAction(any(), any(), any())).thenReturn(Optional.empty());
        when(swipeRepository.save(any(Swipe.class))).thenAnswer(i -> i.getArguments()[0]);

        // When
        SwipeResponse response = swipeService.swipe(request);

        // Then
        assertThat(response.getIsMatch()).isFalse();
        verify(matchService, never()).createMatch(any(), any());
    }

    @Test
    @DisplayName("Should throw exception when trying to swipe yourself")
    void shouldThrowExceptionWhenSwipingSelf() {
        mockAuth();
        SwipeRequest request = new SwipeRequest();
        request.setSwipedUserId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(currentUser));

        assertThatThrownBy(() -> swipeService.swipe(request))
                .isInstanceOf(BadRequestException.class);
    }
}