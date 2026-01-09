package com.beerfinder.service;

import com.beerfinder.dto.MessageRequest;
import com.beerfinder.dto.MessageResponse;
import com.beerfinder.entity.Match;
import com.beerfinder.entity.Message;
import com.beerfinder.entity.User;
import com.beerfinder.exception.BadRequestException;
import com.beerfinder.repository.MatchRepository;
import com.beerfinder.repository.MessageRepository;
import com.beerfinder.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MessageServiceTest {

    @Mock private MessageRepository messageRepository;
    @Mock private MatchRepository matchRepository;
    @Mock private UserRepository userRepository;
    @Mock private SecurityContext securityContext;
    @Mock private Authentication authentication;

    @InjectMocks
    private MessageService messageService;

    private User currentUser;
    private User otherUser;
    private Match userMatch;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.setContext(securityContext);

        currentUser = new User();
        currentUser.setId(1L);
        currentUser.setEmail("me@test.com");

        otherUser = new User();
        otherUser.setId(2L);
        otherUser.setEmail("other@test.com");

        userMatch = new Match();
        userMatch.setId(10L);
        userMatch.setUser1(currentUser);
        userMatch.setUser2(otherUser);
        userMatch.setIsActive(true);
    }

    private void mockAuth() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("me@test.com");
        when(authentication.isAuthenticated()).thenReturn(true);
        when(userRepository.findByEmail("me@test.com")).thenReturn(Optional.of(currentUser));
    }

    @Test
    void shouldSendMessageWhenUserIsPartOfMatch() {
        // Given
        mockAuth();
        when(matchRepository.findById(10L)).thenReturn(Optional.of(userMatch));

        Message savedMessage = new Message();
        savedMessage.setId(100L);
        savedMessage.setContent("Hi!");
        savedMessage.setSender(currentUser);
        savedMessage.setMatch(userMatch);

        when(messageRepository.save(any(Message.class))).thenReturn(savedMessage);

        MessageRequest request = new MessageRequest();
        request.setMatchId(10L);
        request.setContent("Hi!");

        // When
        MessageResponse response = messageService.sendMessage(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getContent()).isEqualTo("Hi!");
        verify(messageRepository).save(any(Message.class));
    }

    @Test
    void shouldThrowExceptionWhenUserIsNotPartOfMatch() {
        // Given
        mockAuth(); // Zalogowany jako currentUser (ID: 1)

        User user3 = new User(); user3.setId(3L);
        User user4 = new User(); user4.setId(4L);
        Match matchBetweenOthers = new Match();
        matchBetweenOthers.setId(20L);
        matchBetweenOthers.setUser1(user3);
        matchBetweenOthers.setUser2(user4);

        when(matchRepository.findById(20L)).thenReturn(Optional.of(matchBetweenOthers));

        MessageRequest request = new MessageRequest();
        request.setMatchId(20L);

        // When & Then
        assertThatThrownBy(() -> messageService.sendMessage(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("You are not part of this match");
    }
}