package com.beerfinder.service;

import com.beerfinder.dto.MessageRequest;
import com.beerfinder.dto.MessageResponse;
import com.beerfinder.entity.Match;
import com.beerfinder.entity.Message;
import com.beerfinder.entity.User;
import com.beerfinder.exception.BadRequestException;
import com.beerfinder.exception.ResourceNotFoundException;
import com.beerfinder.repository.MatchRepository;
import com.beerfinder.repository.MessageRepository;
import com.beerfinder.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MessageService {

    private final MessageRepository messageRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository,
                          MatchRepository matchRepository,
                          UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
    }

    /**
     * Wysyła wiadomość w ramach matcha
     */
    public MessageResponse sendMessage(MessageRequest request) {
        User currentUser = getCurrentUser();

        // Znajdź match
        Match match = matchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Match", "id", request.getMatchId()));

        // Sprawdź czy current user jest częścią tego matcha
        if (!match.getUser1().getId().equals(currentUser.getId()) &&
                !match.getUser2().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You are not part of this match");
        }

        // Sprawdź czy match jest aktywny
        if (!match.getIsActive()) {
            throw new BadRequestException("This match is no longer active");
        }

        // Stwórz wiadomość
        Message message = new Message();
        message.setMatch(match);
        message.setSender(currentUser);
        message.setContent(request.getContent());
        message.setIsRead(false);

        Message savedMessage = messageRepository.save(message);
        return MessageResponse.fromEntity(savedMessage);
    }

    /**
     * Pobiera historię chatu dla danego matcha
     */
    public List<MessageResponse> getChatHistory(Long matchId) {
        User currentUser = getCurrentUser();

        // Znajdź match
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match", "id", matchId));

        // Sprawdź czy current user jest częścią tego matcha
        if (!match.getUser1().getId().equals(currentUser.getId()) &&
                !match.getUser2().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You are not part of this match");
        }

        // Pobierz wszystkie wiadomości
        List<Message> messages = messageRepository.findByMatchOrderByCreatedAtAsc(match);

        // Oznacz wiadomości jako przeczytane (tylko te nie wysłane przez current user)
        messages.stream()
                .filter(msg -> !msg.getSender().getId().equals(currentUser.getId()))
                .filter(msg -> !msg.getIsRead())
                .forEach(msg -> msg.setIsRead(true));

        return messages.stream()
                .map(MessageResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Pobiera liczbę nieprzeczytanych wiadomości dla użytkownika w danym matchu
     */
    public Long getUnreadCount(Long matchId) {
        User currentUser = getCurrentUser();

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match", "id", matchId));

        return messageRepository.countByMatchAndSenderIdNotAndIsReadFalse(match, currentUser.getId());
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new BadRequestException("No authenticated user found");
        }
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}