# Beer Finder

Aplikacja webowa do znajdowania towarzystwa na piwo - swipuj profile, matchuj się z ludźmi i umów się na spotkanie!

## Opis projektu

Beer Finder to aplikacja łącząca mechanizm swipowania znany z aplikacji randkowych z ideą spotkań towarzyskich. Użytkownicy mogą przeglądać profile innych osób, oznaczać je jako "like" lub "pass", a po wzajemnym polubeniu - rozpocząć konwersację i umówić się na piwo.

## Stack technologiczny

### Backend
- **Java 17**
- **Spring Boot 3.5.7**
- **Spring Security** - autentykacja i autoryzacja
- **Spring Data JPA** - ORM
- **PostgreSQL** - baza danych
- **JWT** - tokeny autentykacyjne
- **Lombok** - redukcja boilerplate code
- **Maven** - zarządzanie zależnościami

### Frontend (TODO)
- React 18
- TypeScript
- Tailwind CSS
- Vite

## Jak uruchomić

### Wymagania
- Java 17+
- PostgreSQL 15+
- Maven 3.8+

### Krok 1: Uruchom PostgreSQL

```bash
# Docker (zalecane)
docker run --name beer-finder-db \
  -e POSTGRES_DB=beer_finder \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

### Krok 2: Skonfiguruj aplikację

Sprawdź `src/main/resources/application.properties` i dostosuj dane do połączenia z bazą danych.

### Krok 3: Uruchom aplikację

```bash
# Z poziomu folderu backend/
./mvnw spring-boot:run
```

Lub w IntelliJ IDEA: uruchom `BeerfinderApplication.java`

### Krok 4: Sprawdź czy działa

Otwórz w przeglądarce:
- **Home:** http://localhost:8080/
- **Health Check:** http://localhost:8080/api/health
- **Actuator:** http://localhost:8080/actuator/health

Powinieneś zobaczyć: `{"message":" Beer Finder API is running!","status":"OK",...}`

## Struktura projektu

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/beerfinder/
│   │   │   ├── config/         # Konfiguracje (Security, CORS)
│   │   │   ├── controller/     # REST Controllers
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   ├── entity/         # JPA Entities
│   │   │   ├── exception/      # Custom Exceptions
│   │   │   ├── repository/     # Spring Data Repositories
│   │   │   ├── security/       # JWT & Security
│   │   │   ├── service/        # Business Logic
│   │   │   └── BeerfinderApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
└── README.md
```

## Model bazy danych

### Tabele:
- **users** - użytkownicy aplikacji
- **profiles** - profile użytkowników (wiek, bio, zdjęcie)
- **swipes** - historia swipe'ów (like/pass)
- **matches** - dopasowania (mutual like)
- **messages** - wiadomości w czacie (TODO)
- **groups** - grupy użytkowników (TODO)

## Status projektu

### Zrobione:
- [x] Setup projektu Spring Boot
- [x] Konfiguracja bazy danych PostgreSQL
- [x] Entities: User, Profile, Swipe, Match
- [x] Repositories: UserRepository, SwipeRepository, MatchRepository
- [x] Podstawowa konfiguracja Security (tymczasowa)
- [x] Health check endpoints

### TODO:
- [ ] JWT Authentication & Authorization
- [ ] REST API Endpoints (Auth, User, Swipe, Match)
- [ ] Business Logic (Services)
- [ ] WebSocket dla czatu
- [ ] Testy jednostkowe
- [ ] Dokumentacja API (Swagger)
- [ ] Frontend w React
- [ ] Deployment

## Zespół

- Wiktoria Sakowska
- Ignacy Mróz
- Marcin Panasko
- Tymoteusz Herkowiak

## Licencja

Projekt studencki - Uniwersytet Gdański, Wydział Informatyki, 2025/2026