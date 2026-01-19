package com.beerfinder.util;

/**
 * Utility class for geographical calculations
 */
public class GeoUtils {

    private static final int EARTH_RADIUS_KM = 6371;

    /**
     * Calculate distance between two points using Haversine formula
     *
     * @param lat1 Latitude of point 1
     * @param lon1 Longitude of point 1
     * @param lat2 Latitude of point 2
     * @param lon2 Longitude of point 2
     * @return Distance in kilometers
     */
    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Convert degrees to radians
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Distance in kilometers
        return EARTH_RADIUS_KM * c;
    }

    /**
     * Check if two points are within specified distance
     *
     * @param lat1        Latitude of point 1
     * @param lon1        Longitude of point 1
     * @param lat2        Latitude of point 2
     * @param lon2        Longitude of point 2
     * @param maxDistance Maximum distance in kilometers
     * @return true if within distance, false otherwise
     */
    public static boolean isWithinDistance(double lat1, double lon1, double lat2, double lon2, double maxDistance) {
        double distance = calculateDistance(lat1, lon1, lat2, lon2);
        return distance <= maxDistance;
    }
}