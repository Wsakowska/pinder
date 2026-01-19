package com.beerfinder.repository;

import com.beerfinder.entity.Profile;
import com.beerfinder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

    Optional<Profile> findByUser(User user);

    // Prosty discover: wszyscy inni użytkownicy, których dany user jeszcze nie swipował
    @Query("""
           SELECT p
           FROM Profile p
           WHERE p.user <> :user
             AND p.user.id NOT IN (
                 SELECT s.swiped.id
                 FROM Swipe s
                 WHERE s.swiper = :user
           )
           """)
    List<Profile> findDiscoverProfiles(@Param("user") User user);

    // Discover z filtrowaniem po wieku
    @Query("""
           SELECT p
           FROM Profile p
           WHERE p.user <> :user
             AND p.user.id NOT IN (
                 SELECT s.swiped.id
                 FROM Swipe s
                 WHERE s.swiper = :user
           )
             AND (:minAge IS NULL OR p.age >= :minAge)
             AND (:maxAge IS NULL OR p.age <= :maxAge)
           """)
    List<Profile> findDiscoverProfilesWithFilters(
            @Param("user") User user,
            @Param("minAge") Integer minAge,
            @Param("maxAge") Integer maxAge
    );
}