package com.beerfinder.controller;

import com.beerfinder.dto.MatchResponse;
import com.beerfinder.service.MatchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@Tag(name = "Matches", description = "Match management - view and interact with matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @Operation(
            summary = "Get all matches",
            description = "Retrieves all active matches for the authenticated user"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Matches retrieved successfully",
                    content = @Content(schema = @Schema(implementation = MatchResponse.class))
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping
    public ResponseEntity<List<MatchResponse>> getMyMatches() {
        List<MatchResponse> matches = matchService.getMyMatches();
        return ResponseEntity.ok(matches);
    }

    @Operation(
            summary = "Get match by ID",
            description = "Retrieves details of a specific match"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Match retrieved successfully",
                    content = @Content(schema = @Schema(implementation = MatchResponse.class))
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Match not found or no access")
    })
    @GetMapping("/{matchId}")
    public ResponseEntity<MatchResponse> getMatchById(
            @Parameter(description = "ID of the match to retrieve")
            @PathVariable Long matchId) {
        MatchResponse match = matchService.getMatchById(matchId);
        return ResponseEntity.ok(match);
    }
}