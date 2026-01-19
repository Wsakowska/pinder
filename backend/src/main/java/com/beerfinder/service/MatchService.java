package com.beerfinder.service;

import com.beerfinder.dto.MatchResponse;
import com.beerfinder.entity.Match;
import com.beerfinder.entity.User;
import com.beerfinder.exception.ResourceNotFoundException;
import com.beerfinder.repository.MatchRepository;
import com.beerfinder.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MatchService {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    public MatchService(MatchRepository matchRepository, UserRepository userRepository) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
    }

    /**
     * Tworzy match między dwoma użytkownikami
     */
    public Match createMatch(User user1, User user2) {
        // Sprawdź czy match już nie istnieje
        if (matchRepository.existsByUser1AndUser2(user1, user2) ||
                matchRepository.existsByUser1AndUser2(user2, user1)) {
            throw new RuntimeException("Match already exists between these users");
        }

        // Stwórz nowy match (user1 zawsze ma mniejsze ID)
        Match match = new Match();
        if (user1.getId() < user2.getId()) {
            match.setUser1(user1);
            match.setUser2(user2);
        } else {
            match.setUser1(user2);
            match.setUser2(user1);
        }
        match.setIsActive(true);

        return matchRepository.save(match);
    }

    /**
     * Pobiera wszystkie aktywne matche zalogowanego użytkownika
     */
    public List<MatchResponse> getMyMatches() {
        User currentUser = getCurrentUser();
        List<Match> matches = matchRepository.findActiveMatchesByUser(currentUser);

        return matches.stream()
                .map(match -> MatchResponse.fromEntity(match, currentUser.getId()))
                .collect(Collectors.toList());
    }

    /**
     * Pobiera szczegóły konkretnego matcha
     */
    public MatchResponse getMatchById(Long matchId) {
        User currentUser = getCurrentUser();
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match", "id", matchId));

        // Sprawdź czy current user jest częścią tego matcha
        if (!match.getUser1().getId().equals(currentUser.getId()) &&
                !match.getUser2().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Match not found or you don't have access");
        }

        return MatchResponse.fromEntity(match, currentUser.getId());
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}