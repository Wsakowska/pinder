```markdown
# Beer Finder — Backend

Beer Finder to aplikacja webowa umożliwiająca znajdowanie towarzystwa na spontaniczne wyjście na piwo.  
Backend odpowiada za rejestrację użytkowników, autentykację JWT, zarządzanie profilami, wyszukiwaniem użytkowników oraz podstawy mechanizmu matchowania.

---

## Spis treści
- [Opis projektu](#opis-projektu)
- [Stack technologiczny](#stack-technologiczny)
- [Funkcjonalności](#funkcjonalności)
- [Architektura](#architektura)
- [Modele danych](#modele-danych)
- [API](#api)
- [Instalacja i uruchomienie](#instalacja-i-uruchomienie)
- [Struktura projektu](#struktura-projektu)
- [Postęp prac](#postęp-prac)
- [Planowane funkcje](#planowane-funkcje)

---

## Opis projektu

Beer Finder łączy mechanizm swipowania profili (podobny do Tindera) z ideą spotkań towarzyskich.  
Użytkownicy mogą:
- tworzyć konto,
- uzupełniać swój profil,
- przeglądać inne profile,
- oznaczać je jako „like” lub „pass”,
- po wzajemnym „like” otrzymywać match i rozpoczynać rozmowę (planowane).

Backend realizuje całą logikę biznesową oraz interakcję z bazą danych.

---

## Stack technologiczny

**Backend**
- Java 17
- Spring Boot 3.5.x
- Spring Security (JWT)
- Spring Data JPA (Hibernate)
- PostgreSQL
- Maven
- Lombok

---

## Funkcjonalności

### Zaimplementowane
- rejestracja użytkownika,
- logowanie z generowaniem JWT,
- automatyczne tworzenie profilu przy rejestracji,
- pobieranie profilu zalogowanego użytkownika (`GET /api/users/me`),
- edycja profilu (`PUT /api/users/profile`),
- lista profili do swipowania (discover),
- pełna konfiguracja bezpieczeństwa (JWT filter, AuthenticationProvider itd.).

### W trakcie implementacji
- logika swipowania (like/pass),
- wykrywanie matcha.

### Planowane
- czat w czasie rzeczywistym (WebSocket),
- system grupowy,
- filtrowanie po lokalizacji,
- upload zdjęć (Cloudinary),
- testy jednostkowe i integracyjne.

---

## Architektura

Projekt wykorzystuje architekturę warstwową:

```

controller → service → repository → entity

```

Warstwy:
- **Controller** – ekspozycja REST API,
- **Service** – logika biznesowa,
- **Repository** – operacje na bazie (JPA),
- **Entity** – model danych,
- **Security** – konfiguracja JWT i Spring Security.

---

## Modele danych

### User
- id  
- email  
- passwordHash  
- createdAt  
- updatedAt  
Relacja: One-to-One z Profile

### Profile
- id  
- userId  
- name  
- age  
- bio  
- occupation  
- interests (lista stringów)  
- latitude, longitude  
- profilePhoto  
- createdAt, updatedAt  

### Swipe
- id  
- swiperId  
- swipedId  
- action: LIKE / PASS  
- createdAt  

### Match
- id  
- user1Id  
- user2Id  
- isActive  
- createdAt  

---

## API

### Endpointy publiczne

#### Health check
```

GET /api/health

```

#### Rejestracja
```

POST /api/auth/register
Content-Type: application/json

````
Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
````

#### Logowanie

```
POST /api/auth/login
```

Body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Odpowiedź zawiera JWT token.

---

### Endpointy wymagające autoryzacji

Nagłówek:

```
Authorization: Bearer <token>
```

#### Pobranie własnego profilu

```
GET /api/users/me
```

#### Aktualizacja profilu

```
PUT /api/users/profile
```

Przykładowe body:

```json
{
  "name": "Wiktoria",
  "age": 21,
  "bio": "Lubię backend",
  "occupation": "Student",
  "interests": ["sport", "piwo"],
  "latitude": 54.35,
  "longitude": 18.64,
  "profilePhoto": "https://example.com/photo.jpg"
}
```

#### Lista profili do „discover”

```
GET /api/users/discover
```

---

## Instalacja i uruchomienie

### Wymagania

* Java 17+
* PostgreSQL 15+
* Maven 3.8+

### 1. Uruchom PostgreSQL (np. Docker)

```bash
docker run --name beerfinder-db \
  -e POSTGRES_DB=beer_finder \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

### 2. Uruchom backend

```bash
./mvnw spring-boot:run
```

lub w IntelliJ: `BeerfinderApplication.java`

Aplikacja działa pod:
`http://localhost:8080`

---

## Struktura projektu

```
src/main/java/com/beerfinder/
├── config/                  # Konfiguracja bezpieczeństwa
├── controller/              # REST API
├── dto/                     # Obiekty żądań i odpowiedzi
├── entity/                  # Encje JPA
├── repository/              # Repozytoria JPA
├── security/                # JWT, filtry, UserDetailsService
├── service/                 # Logika biznesowa
└── BeerfinderApplication     # Klasa startowa
```

---

## Postęp prac

### Sprint 1 – Fundament (zakończony)

* konfiguracja projektu i bazy,
* encje: User, Profile, Swipe, Match,
* konfiguracja JWT i bezpieczeństwa.

### Sprint 2 – Autentykacja (zakończony)

* rejestracja i logowanie,
* generowanie JWT,
* automatyczne tworzenie profilu.

### Sprint 3 – Profile użytkownika (w trakcie)

* pobieranie profilu,
* edycja profilu,
* discover użytkowników.

### Sprint 4 – Swipowanie (planowany)

* endpoint POST /api/swipes,
* algorytm matchowania.

### Sprint 5 – Chat (planowany)

### Sprint 6 – Funkcje dodatkowe (planowane)

* grupy,
* geolokalizacja,
* propozycje miejsc.

---

## Planowane funkcje

* WebSocket chat
* zarządzanie matchami
* filtrowanie po lokalizacji
* rekomendacje miejsc (Google Maps API)
* testy jednostkowe i integracyjne
* Docker Compose (backend + baza)

---

```
