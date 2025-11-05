# Beer Finder

Aplikacja webowa do znajdowania towarzystwa na piwo - swipuj profile, matchuj się z ludźmi i umów się na spotkanie.

## Opis projektu

Beer Finder to aplikacja łącząca mechanizm swipowania znany z aplikacji randkowych z ideą spotkań towarzyskich. Użytkownicy mogą przeglądać profile innych osób, oznaczać je jako "like" lub "pass", a po wzajemnym polubieni - rozpocząć konwersację i umówić się na piwo.

## Stack technologiczny

### Backend
- **Java 17**
- **Spring Boot 3.5.7**
- **Spring Security** - autentykacja i autoryzacja JWT
- **Spring Data JPA** - ORM
- **PostgreSQL** - baza danych
- **JWT (jjwt 0.12.3)** - tokeny autentykacyjne
- **BCrypt** - hashowanie haseł
- **Lombok** - redukcja boilerplate code
- **Maven** - zarządzanie zależnościami

### Frontend (TODO)
- React 18
- TypeScript
- Tailwind CSS
- Vite

## Jak uruchomić projekt

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

Sprawdź `src/main/resources/application.properties` i dostosuj dane do połączenia z bazą danych jeśli potrzeba.

### Krok 3: Uruchom aplikację
```bash
# Z poziomu folderu backend/
./mvnw spring-boot:run
```

Lub w IntelliJ IDEA: uruchom `BeerfinderApplication.java`

### Krok 4: Sprawdź czy działa

Aplikacja powinna być dostępna na: http://localhost:8080

## API Endpoints

### Publiczne (bez autoryzacji)

#### Health Check
```bash
GET http://localhost:8080/
GET http://localhost:8080/api/health
```

#### Rejestracja
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Odpowiedź:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "userId": 1,
  "email": "user@example.com"
}
```

#### Logowanie
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Odpowiedź:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "userId": 1,
  "email": "user@example.com"
}
```

### Chronione (wymagają JWT token)

Dla endpointów chronionych dodaj header:
```
Authorization: Bearer <your-jwt-token>
```

## Testowanie API

### Przykład użycia z curl:
```bash
# 1. Rejestracja
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# 2. Logowanie
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Zapisz otrzymany token i użyj go w kolejnych requestach
```

## Struktura projektu
```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/beerfinder/
│   │   │   ├── config/              # Konfiguracje
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/          # REST Controllers
│   │   │   │   └── AuthController.java
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   ├── RegisterRequest.java
│   │   │   │   ├── LoginRequest.java
│   │   │   │   └── AuthResponse.java
│   │   │   ├── entity/              # JPA Entities
│   │   │   │   ├── User.java
│   │   │   │   ├── Profile.java
│   │   │   │   ├── Swipe.java
│   │   │   │   ├── SwipeAction.java
│   │   │   │   └── Match.java
│   │   │   ├── repository/          # Spring Data Repositories
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── SwipeRepository.java
│   │   │   │   └── MatchRepository.java
│   │   │   ├── security/            # JWT & Security
│   │   │   │   ├── JwtUtil.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   └── CustomUserDetailsService.java
│   │   │   ├── service/             # Business Logic
│   │   │   │   └── AuthService.java
│   │   │   └── BeerfinderApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
└── README.md
```

## Model bazy danych

### Encje:

**User**
- `id` (Long, PK)
- `email` (String, unique)
- `password_hash` (String)
- `created_at` (LocalDateTime)
- `updated_at` (LocalDateTime)
- Relacja: One-to-One z Profile

**Profile**
- `id` (Long, PK)
- `user_id` (Long, FK)
- `name` (String)
- `age` (Integer)
- `bio` (String)
- `occupation` (String)
- `interests` (List<String>)
- `latitude`, `longitude` (Double)
- `profile_photo` (String)
- `created_at`, `updated_at` (LocalDateTime)

**Swipe**
- `id` (Long, PK)
- `swiper_id` (Long, FK)
- `swiped_id` (Long, FK)
- `action` (SwipeAction: LIKE/PASS)
- `created_at` (LocalDateTime)
- Constraint: unique(swiper_id, swiped_id)

**Match**
- `id` (Long, PK)
- `user1_id` (Long, FK)
- `user2_id` (Long, FK)
- `is_active` (Boolean)
- `created_at` (LocalDateTime)
- Constraint: unique(user1_id, user2_id)

**Message** (TODO)
**Group** (TODO)
**GroupMember** (TODO)

## Bezpieczeństwo

### Implementowane mechanizmy:
- Hashowanie haseł za pomocą BCrypt (strength: 10)
- Autentykacja JWT (ważność tokenu: 7 dni)
- CORS skonfigurowany dla frontendu (localhost:5173, localhost:3000)
- Spring Security z filtrem JWT dla chronionych endpointów
- Sesje STATELESS (nie używamy cookies)
- Walidacja danych wejściowych (email format, długość hasła min. 6 znaków)

## Status projektu

### Zrobione:

**Sprint 1: Fundament**
- [x] Setup projektu Spring Boot 3.5.7
- [x] Konfiguracja PostgreSQL + Hibernate
- [x] Entities: User, Profile, Swipe, Match, SwipeAction
- [x] Repositories: UserRepository, SwipeRepository, MatchRepository
- [x] JWT Utility (generowanie i walidacja tokenów)
- [x] Spring Security configuration
- [x] JwtAuthenticationFilter (przechwytywanie i walidacja JWT)
- [x] CustomUserDetailsService (ładowanie użytkowników)
- [x] BCrypt password encoder

**Sprint 2: Autentykacja**
- [x] DTOs: RegisterRequest, LoginRequest, AuthResponse
- [x] AuthService (logika rejestracji i logowania)
- [x] AuthController (endpointy REST)
- [x] POST /api/auth/register - rejestracja użytkownika
- [x] POST /api/auth/login - logowanie użytkownika
- [x] Automatyczne tworzenie profilu przy rejestracji
- [x] Obsługa błędów (duplikaty email, nieprawidłowe dane)

### TODO:

**Sprint 3: Profile użytkownika**
- [ ] GET /api/users/me - pobranie własnego profilu
- [ ] PUT /api/users/profile - edycja profilu
- [ ] Upload zdjęć profilowych (Cloudinary)
- [ ] GET /api/users/discover - lista użytkowników do swipe

**Sprint 4: Swipowanie i matchowanie**
- [ ] POST /api/swipes - wykonanie swipe (like/pass)
- [ ] GET /api/matches - lista matchów
- [ ] Algorytm wykrywania wzajemnych like
- [ ] Logika matchowania

**Sprint 5: Chat**
- [ ] WebSocket configuration (Spring WebSocket + STOMP)
- [ ] Entity Message
- [ ] Real-time messaging
- [ ] GET /api/messages/:matchId - historia wiadomości
- [ ] POST /api/messages - wysłanie wiadomości

**Sprint 6: Zaawansowane funkcje**
- [ ] Tryb grupowy (grupy użytkowników)
- [ ] Geolokalizacja (filtrowanie po odległości)
- [ ] Propozycje miejsc spotkań (Google Maps API)

**Dokumentacja i testy**
- [ ] Swagger/OpenAPI documentation
- [ ] Testy jednostkowe (JUnit + Mockito)
- [ ] Testy integracyjne (@SpringBootTest)
- [ ] Frontend (React + TypeScript)
- [ ] Deployment (Docker + Railway/Render)

## Troubleshooting

### Problem z połączeniem do bazy danych
Sprawdź czy PostgreSQL działa:
```bash
docker ps
```

Jeśli nie ma kontenera, uruchom go ponownie (Krok 1).

### Problem z Lombok w IntelliJ
1. File → Settings → Plugins → zainstaluj Lombok plugin
2. File → Settings → Build, Execution, Deployment → Compiler → Annotation Processors
3. Zaznacz "Enable annotation processing"
4. Rebuild Project

### Maven wrapper nie działa
```bash
mvn wrapper:wrapper
./mvnw clean install
```

## Zespół

- Wiktoria Sakowska
- Ignacy Mróz
- Marcin Panasko
- Tymoteusz Herkowiak

## Licencja

Projekt studencki - Uniwersytet Gdański, Wydział Informatyki, 2025/2026