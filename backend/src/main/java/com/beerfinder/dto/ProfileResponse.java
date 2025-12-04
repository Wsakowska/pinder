package com.beerfinder.dto;

import com.beerfinder.entity.Profile;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {

    private Long id;
    private Long userId;
    private String name;
    private Integer age;
    private String bio;
    private String occupation;
    private List<String> interests;
    private Double latitude;
    private Double longitude;
    private String profilePhoto;

    public static ProfileResponse fromEntity(Profile profile) {
        if (profile == null) {
            return null;
        }

        return new ProfileResponse(
                profile.getId(),
                profile.getUser() != null ? profile.getUser().getId() : null,
                profile.getName(),
                profile.getAge(),
                profile.getBio(),
                profile.getOccupation(),
                profile.getInterests(),
                profile.getLatitude(),
                profile.getLongitude(),
                profile.getProfilePhoto()
        );
    }
}
