package com.beerfinder.repository;

import com.beerfinder.entity.Match;
import com.beerfinder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    @Query("SELECT m FROM Match m WHERE (m.user1 = :user OR m.user2 = :user) AND m.isActive = true")
    List<Match> findActiveMatchesByUser(@Param("user") User user);

    Boolean existsByUser1AndUser2(User user1, User user2);
}