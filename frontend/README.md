

# BeerFinder – Frontend (Vite + React + TypeScript + Tailwind CSS)

## Dokumentacja projektu

---

## Spis treści

1. [Opis projektu](#opis-projektu)  
2. [Technologie](#technologie)  
3. [Struktura projektu](#struktura-projektu)  
4. [Instalacja i uruchomienie](#instalacja-i-uruchomienie)  
5. [Konfiguracja](#konfiguracja)  
6. [Endpointy API](#endpointy-api)  
7. [Funkcjonalności](#funkcjonalności)  
8. [Stylizacja (Tailwind)](#stylizacja-tailwind)  
9. [Bezpieczeństwo i tokeny](#bezpieczeństwo-i-tokeny)  
10. [Rozwój i produkcja](#rozwój-i-produkcja)  
11. [Rozwiązywanie problemów](#rozwiązywanie-problemów)
---
<a name="Opis projektu"></a>

## 1. Opis projektu
piwo + tinder 😼



<a name="technologie"></a>
## 2. Technologie

| Technologia         | Wersja       | Opis |
|---------------------|--------------|------|
| Vite                | `^5.0.0`     | Szybki build tool |
| React               | `^18.2.0`    | Biblioteka UI |
| TypeScript          | `^5.0.0`     | Typowanie |
| Tailwind CSS        | `^3.4.0`     | Stylizacja utility-first |
| React Router        | `^6.20.0`    | Nawigacja |
| Fetch API           | natywny      | Komunikacja HTTP |

---

<a name="struktura-projektu"></a>
## 3. Struktura projektu

```
src/
├── api/
│   └── auth.ts                  # Zapytania do /api/auth
├── components/
│   ├── AuthLayout.tsx           # Wspólny layout (logo, karta)
│   ├── LoginForm.tsx            # Formularz logowania
│   └── RegisterForm.tsx         # Formularz rejestracji
├── pages/
│   ├── LoginPage.tsx            # Strona /login
│   ├── RegisterPage.tsx         # Strona /register
│   └── TestPage.tsx             # Strona /test (chroniona)
├── types/
│   └── auth.ts                  # Typy DTO (LoginRequest, AuthResponse)
├── App.tsx                      # Router główny
├── main.tsx                     # Entry point
└── index.css                    # Dyrektywy Tailwind (@tailwind)
```

---

<a name="instalacja-i-uruchomienie"></a>
## 4. Instalacja i uruchomienie

### Wymagania
- Node.js ≥ 18
- npm ≥ 9

### Krok po kroku

```bash
# 1. Sklonuj lub skopiuj projekt
git clone <repo> beer-finder-frontend
cd beer-finder-frontend

# 2. Zainstaluj zależności
npm install

# 3. Zainstaluj Tailwind + Lucide
npm install -D tailwindcss postcss autoprefixer
npm install lucide-react

# 4. Utwórz pliki konfiguracyjne
npx tailwindcss init -p

# 5. Utwórz plik .env
echo "VITE_API_URL=http://localhost:8080/api/auth" > .env

# 6. Uruchom serwer deweloperski
npm run dev
```

Dostęp: [http://localhost:5173](http://localhost:5173)

---

<a name="konfiguracja"></a>
## 5. Konfiguracja

### Pliki konfiguracyjne

| Plik                | Opis |
|---------------------|------|
| `tailwind.config.js` | Ścieżki do plików z klasami Tailwind |
| `postcss.config.js`  | Wtyczki PostCSS (Tailwind + Autoprefixer) |
| `.env`               | URL backendu (`VITE_API_URL`) |
| `vite.config.ts`     | (opcjonalnie) proxy dla `/api` |

#### Przykład `.env`

```env
VITE_API_URL=http://localhost:8080/api/auth
```

> **Uwaga:** Zmienne środowiskowe w Vite muszą zaczynać się od `VITE_`.

---

<a name="endpointy-api"></a>
## 6. Endpointy API

| Metoda | Ścieżka               | Ciało               | Opis |
|--------|-----------------------|---------------------|------|
| `POST` | `/api/auth/register`  | `RegisterRequest`   | Rejestracja użytkownika |
| `POST` | `/api/auth/login`     | `LoginRequest`      | Logowanie |
| `GET`  | `/api/auth/test`      | –                   | Test połączenia (wymaga tokenu) |
|        | `/api/auth/dashboard` | –                   | strona do swipeowania |

---

<a name="funkcjonalności"></a>
## 7. Funkcjonalności

| Funkcja             | Opis |
|---------------------|------|
| Rejestracja         | Email, hasło, imię i wiek (opcjonalne) |
| Logowanie           | Email + hasło |
| Test połączenia     | `/test` – sprawdza ważność tokenu |
| Wylogowanie         | Czyści `localStorage` |
| Walidacja formularzy| Klient + serwer (błędy w czerwonych ramkach) |
| Responsywność       | Działa na telefonach i tabletach |
| testy logowanie + swipeowanie | uzywa mocka do logowania i swipeowania |

---

<a name="stylizacja-tailwind"></a>
## 8. Stylizacja (Tailwind CSS)

### Kolorystyka
- **Główny kolor**: `amber-600` (kolor piwa)
- **Tło gradientowe**: `from-amber-50 to-orange-100`
- **Karta**: biała z cieniem (`shadow-xl`)

### Komponenty
- **Przyciski**: `bg-amber-600 hover:bg-amber-700 text-white rounded-md`
- **Inputy**: `border-gray-300 focus:ring-amber-500 focus:border-amber-500`
- **Komunikaty**: 
  - Sukces: `bg-green-50 text-green-700`
  - Błąd: `bg-red-50 text-red-600`

---

<a name="bezpieczeństwo-i-tokeny"></a>
## 9. Bezpieczeństwo i tokeny

- Token JWT przechowywany w `localStorage`
- Dodawany jako nagłówek:
  ```ts
  Authorization: Bearer <token>
  ```
- Strona `/test` wymaga zalogowania – w przypadku błędu 401 przekierowuje do `/login`

```ts
localStorage.setItem('token', data.token);
```

---

<a name="rozwój-i-produkcja"></a>
## 10. Rozwój i produkcja

### Tryb deweloperski

```bash
npm run dev
→ http://localhost:5173
```

### Budowanie do produkcji

```bash
npm run build
→ folder dist/
```

### Połączenie z backendem
--
! Do polaczenia z backendem sluzy plik /src/api/realAuth.ts (obecnie uzywany jest mock do fake logowania i swipeowania)
Nalezy zmienic nazwe realAuth.ts na auth.ts i zmienic nazwe obecnego mocka na inna w celu dodania backendu.
--
Do rozważenia:
#### Opcja A: **Osobne serwery (development)**
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`
- **Wymagany CORS w backendzie**

#### Opcja B: **Statyczne pliki w backendzie (production)**

```bash
# 1. Zbuduj frontend
npm run build

# 2. Skopiuj dist/ → backend/src/main/resources/static/
# 3. Zmień API_BASE w kodzie:
const API_BASE = '/api/auth';
```

→ Całość dostępna na `http://localhost:8080`

---

<a name="rozwiązywanie-problemów"></a>
## 11. Rozwiązywanie częstych problemów

| Problem                        | Rozwiązanie |
|-------------------------------|-------------|
| Brak stylów                   | Sprawdź `import './index.css'` w `main.tsx` |
| Błąd CORS                     | Dodaj `CorsConfig.java` w backendzie |
| `npx tailwindcss init` nie działa | Ręcznie utwórz `tailwind.config.js` |
| Token nie działa              | Sprawdź `localStorage` w DevTools |
| Błąd 401 na `/test`           | Zaloguj się ponownie |






*doc ver 1.0*
*\>\^. , .\^<*
