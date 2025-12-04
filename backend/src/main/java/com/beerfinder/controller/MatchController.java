package com.beerfinder.controller;

import com.beerfinder.dto.MatchResponse;
import com.beerfinder.service.MatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    /**
     * GET /api/matches - pobiera wszystkie matche zalogowanego użytkownika
     */
    @GetMapping
    public ResponseEntity<List<MatchResponse>> getMyMatches() {
        List<MatchResponse> matches = matchService.getMyMatches();
        return ResponseEntity.ok(matches);
    }

    /**
     * GET /api/matches/{id} - pobiera szczegóły konkretnego matcha
     */
    @GetMapping("/{matchId}")
    public ResponseEntity<MatchResponse> getMatchById(@PathVariable Long matchId) {
        MatchResponse match = matchService.getMatchById(matchId);
        return ResponseEntity.ok(match);
    }
}