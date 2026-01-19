package com.beerfinder.dto;

import com.beerfinder.entity.Match;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchResponse {

    private Long matchId;
    private ProfileResponse matchedUser; // Profil dopasowanej osoby
    private Boolean isActive;
    private LocalDateTime createdAt;

    public static MatchResponse fromEntity(Match match, Long currentUserId) {
        if (match == null) {
            return null;
        }

        // Określ który user to matched user (nie current user)
        ProfileResponse matchedProfile;
        if (match.getUser1().getId().equals(currentUserId)) {
            matchedProfile = ProfileResponse.fromEntity(match.getUser2().getProfile());
        } else {
            matchedProfile = ProfileResponse.fromEntity(match.getUser1().getProfile());
        }

        return new MatchResponse(
                match.getId(),
                matchedProfile,
                match.getIsActive(),
                match.getCreatedAt()
        );
    }
}