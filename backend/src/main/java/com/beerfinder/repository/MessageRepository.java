package com.beerfinder.repository;

import com.beerfinder.entity.Match;
import com.beerfinder.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Znajdź wszystkie wiadomości dla danego matcha, posortowane chronologicznie
    List<Message> findByMatchOrderByCreatedAtAsc(Match match);

    // Policz nieprzeczytane wiadomości dla użytkownika w danym matchu
    Long countByMatchAndSenderIdNotAndIsReadFalse(Match match, Long senderId);
}