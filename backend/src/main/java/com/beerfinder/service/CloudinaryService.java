package com.beerfinder.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Upload image to Cloudinary and return the secure URL
     *
     * @param file - image file from multipart request
     * @return secure URL of uploaded image
     * @throws IOException if upload fails
     */
    public String uploadImage(MultipartFile file) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Validate file type (only images)
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        // Validate file size (max 5MB)
        long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File size must be less than 5MB");
        }

        // Upload to Cloudinary with options
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "beerfinder/profiles", // Organize in folders
                        "resource_type", "image",
                        "format", "jpg", // Convert all to JPG
                        "quality", "auto:good", // Auto quality optimization
                        "transformation", new com.cloudinary.Transformation()
                                .width(800).height(800).crop("fill") // Resize to 800x800
                ));

        // Return secure HTTPS URL
        return (String) uploadResult.get("secure_url");
    }

    /**
     * Delete image from Cloudinary
     *
     * @param publicId - public ID of the image (extracted from URL)
     * @throws IOException if deletion fails
     */
    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    /**
     * Extract public ID from Cloudinary URL
     * Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/beerfinder/profiles/abc123.jpg
     * Returns: beerfinder/profiles/abc123
     */
    public String extractPublicId(String imageUrl) {
        if (imageUrl == null || !imageUrl.contains("cloudinary.com")) {
            return null;
        }

        try {
            String[] parts = imageUrl.split("/upload/");
            if (parts.length < 2) return null;

            String afterUpload = parts[1];
            // Remove version (v1234567890/)
            String withoutVersion = afterUpload.replaceFirst("v\\d+/", "");
            // Remove file extension
            return withoutVersion.substring(0, withoutVersion.lastIndexOf('.'));
        } catch (Exception e) {
            return null;
        }
    }
}