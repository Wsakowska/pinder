package com.beerfinder.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class UpdateProfileRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @Min(value = 18, message = "Age must be at least 18")
    private Integer age;

    private String bio;

    private String occupation;

    // Na razie lista stringów, bez osobnej tabeli
    private List<String> interests;

    private Double latitude;

    private Double longitude;

    // URL do zdjęcia (np. z Cloudinary)
    private String profilePhoto;

    // --- getters / setters ---

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public List<String> getInterests() {
        return interests;
    }

    public void setInterests(List<String> interests) {
        this.interests = interests;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }
}
