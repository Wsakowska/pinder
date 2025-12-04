package com.beerfinder.service;

import com.beerfinder.dto.SwipeRequest;
import com.beerfinder.dto.SwipeResponse;
import com.beerfinder.entity.Match;
import com.beerfinder.entity.Swipe;
import com.beerfinder.entity.SwipeAction;
import com.beerfinder.entity.User;
import com.beerfinder.exception.BadRequestException;
import com.beerfinder.exception.ResourceNotFoundException;
import com.beerfinder.repository.SwipeRepository;
import com.beerfinder.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class SwipeService {

    private final SwipeRepository swipeRepository;
    private final UserRepository userRepository;
    private final MatchService matchService;

    public SwipeService(SwipeRepository swipeRepository,
                        UserRepository userRepository,
                        MatchService matchService) {
        this.swipeRepository = swipeRepository;
        this.userRepository = userRepository;
        this.matchService = matchService;
    }

    /**
     * Wykonuje swipe (LIKE lub PASS) i sprawdza czy powstał match
     */
    public SwipeResponse swipe(SwipeRequest request) {
        User currentUser = getCurrentUser();

        // Znajdź użytkownika którego swipujemy
        User swipedUser = userRepository.findById(request.getSwipedUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getSwipedUserId()));

        // Sprawdź czy nie swipujemy samego siebie
        if (currentUser.getId().equals(swipedUser.getId())) {
            throw new BadRequestException("Cannot swipe yourself");
        }

        // Sprawdź czy już nie został wykonany swipe
        if (swipeRepository.existsBySwiperAndSwiped(currentUser, swipedUser)) {
            throw new BadRequestException("You have already swiped this user");
        }

        // Stwórz swipe
        Swipe swipe = new Swipe();
        swipe.setSwiper(currentUser);
        swipe.setSwiped(swipedUser);
        swipe.setAction(request.getAction());
        Swipe savedSwipe = swipeRepository.save(swipe);

        // Sprawdź czy powstał match (tylko jeśli LIKE)
        boolean isMatch = false;
        Long matchId = null;
        String message;

        if (request.getAction() == SwipeAction.LIKE) {
            // Sprawdź czy druga osoba też nas lajknęła
            Optional<Swipe> reverseSwipe = swipeRepository.findBySwiperAndSwipedAndAction(
                    swipedUser, currentUser, SwipeAction.LIKE
            );

            if (reverseSwipe.isPresent()) {
                // Jest match!
                isMatch = true;
                Match match = matchService.createMatch(currentUser, swipedUser);
                matchId = match.getId();
                message = "It's a match! 🎉";
            } else {
                message = "Swipe recorded";
            }
        } else {
            message = "Swipe recorded";
        }

        return new SwipeResponse(
                savedSwipe.getId(),
                currentUser.getId(),
                swipedUser.getId(),
                request.getAction(),
                isMatch,
                matchId,
                message
        );
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