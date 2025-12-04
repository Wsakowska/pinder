package com.beerfinder.controller;

import com.beerfinder.dto.SwipeRequest;
import com.beerfinder.dto.SwipeResponse;
import com.beerfinder.service.SwipeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/swipes")
public class SwipeController {

    private final SwipeService swipeService;

    public SwipeController(SwipeService swipeService) {
        this.swipeService = swipeService;
    }

    /**
     * POST /api/swipes - wykonaj swipe (LIKE lub PASS)
     */
    @PostMapping
    public ResponseEntity<SwipeResponse> swipe(@Valid @RequestBody SwipeRequest request) {
        SwipeResponse response = swipeService.swipe(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}