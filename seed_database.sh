#!/bin/bash

echo "🍺 BeerFinder - Seed Database Script"
echo "====================================="
echo ""

BACKEND_URL="http://localhost:8080"

# Kolory dla outputu
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Tablica użytkowników do stworzenia (30 osób)
declare -a USERS=(
  # Pierwsze 10 - z matchami
  "anna.kowalska@test.com:password123:Anna Kowalska:28:Lubię piwo kraftowe i IPAs, szukam towarzystwa do degustacji:Software Developer:Piwo,Muzyka,Podróże:54.352:18.646:https://i.pravatar.cc/400?img=1"
  "jan.nowak@test.com:password123:Jan Nowak:32:Fan stoutów i portów, chodźmy na piwo!:Product Manager:Piwo,Gaming,Sport:54.355:18.650:https://i.pravatar.cc/400?img=12"
  "ewa.wisniewski@test.com:password123:Ewa Wiśniewska:25:Miłośniczka piw belgijskich, zawsze gotowa na nowe smaki:UX Designer:Piwo,Sztuka,Joga:54.348:18.642:https://i.pravatar.cc/400?img=5"
  "piotr.zielinski@test.com:password123:Piotr Zieliński:30:Piwo to życie! Poznaję świat przez piwo:DevOps Engineer:Piwo,Technologia,Fotografia:54.358:18.648:https://i.pravatar.cc/400?img=15"
  "kasia.nowacka@test.com:password123:Kasia Nowacka:27:Kocham piwa pszeniczne, szukam kompana do pubów:Marketing Specialist:Piwo,Fashion,Travel:54.350:18.645:https://i.pravatar.cc/400?img=9"
  "tomasz.wojcik@test.com:password123:Tomasz Wójcik:29:Craft beer enthusiast, zawsze otwarty na nowe doświadczenia:Backend Developer:Piwo,Coding,Music:54.353:18.649:https://i.pravatar.cc/400?img=13"
  "maria.dabrowska@test.com:password123:Maria Dąbrowska:26:Lubię eksperymentować z piwem, jestem nowa w mieście:Data Scientist:Piwo,Books,Hiking:54.356:18.644:https://i.pravatar.cc/400?img=10"
  "marek.lewandowski@test.com:password123:Marek Lewandowski:31:Wielbiciel piw regionalnych, poznaję lokalne browary:Sales Manager:Piwo,Fishing,Cars:54.349:18.651:https://i.pravatar.cc/400?img=33"
  "agata.kaminska@test.com:password123:Agata Kamińska:24:Rozpoczynam przygodę z piwem, chętnie się uczę:Junior Developer:Piwo,Anime,Cooking:54.354:18.647:https://i.pravatar.cc/400?img=20"
  "lukasz.kowalczyk@test.com:password123:Łukasz Kowalczyk:33:Piwo i przyjaciele - idealne combo. Szukam stałej ekipy:Architect:Piwo,Design,Photography:54.351:18.643:https://i.pravatar.cc/400?img=17"

  # Kolejne 20 - do swipowania
  "zofia.mazur@test.com:password123:Zofia Mazur:29:Pasjonatka piw kwaśnych i sour. Poznajmy się przy dobrym piwie!:Graphic Designer:Piwo,Art,Cinema:54.357:18.652:https://i.pravatar.cc/400?img=2"
  "adam.krawczyk@test.com:password123:Adam Krawczyk:35:Kolekcjoner etykiet z piw z całego świata:Business Analyst:Piwo,Travel,History:54.346:18.641:https://i.pravatar.cc/400?img=11"
  "natalia.piotrowska@test.com:password123:Natalia Piotrowska:23:Dopiero zaczynam swoją przygodę z piwem rzemieślniczym:Content Creator:Piwo,Social Media,Fitness:54.359:18.647:https://i.pravatar.cc/400?img=3"
  "kamil.grabowski@test.com:password123:Kamil Grabowski:28:Homebrew enthusiast, warzę własne piwo!:QA Engineer:Piwo,Science,Brewing:54.354:18.653:https://i.pravatar.cc/400?img=14"
  "julia.pawlak@test.com:password123:Julia Pawłak:26:Szukam kogoś do odwiedzania lokalnych browarów:HR Manager:Piwo,Reading,Yoga:54.347:18.639:https://i.pravatar.cc/400?img=6"
  "michal.witkowski@test.com:password123:Michał Witkowski:31:Piwo i dobra rozmowa - czego chcieć więcej?:Frontend Developer:Piwo,Gaming,Movies:54.360:18.644:https://i.pravatar.cc/400?img=16"
  "aleksandra.walczak@test.com:password123:Aleksandra Walczak:27:Lubię ciemne piwa i wieczory przy barze:Financial Analyst:Piwo,Finance,Running:54.351:18.654:https://i.pravatar.cc/400?img=7"
  "sebastian.sokolowski@test.com:password123:Sebastian Sokołowski:34:Beer geek, znam się na rzeczy. AMA o piwie!:System Administrator:Piwo,Technology,Photography:54.345:18.640:https://i.pravatar.cc/400?img=18"
  "karolina.wojciechowska@test.com:password123:Karolina Wojciechowska:25:Studentka, która odkryła piwo kraftowe:Student:Piwo,Parties,Music Festivals:54.361:18.645:https://i.pravatar.cc/400?img=8"
  "bartosz.chmielewski@test.com:password123:Bartosz Chmielewski:29:Organizuję beer tastingi dla przyjaciół:Event Manager:Piwo,Events,Networking:54.348:18.655:https://i.pravatar.cc/400?img=19"
  "magdalena.stepien@test.com:password123:Magdalena Stępień:32:Piwo w dobrej kompanii to najlepszy wieczór:Teacher:Piwo,Education,Books:54.356:18.638:https://i.pravatar.cc/400?img=4"
  "rafal.czarnecki@test.com:password123:Rafał Czarnecki:30:Znawca piw niemieckich, lubię pogłębione rozmowy:Software Architect:Piwo,Philosophy,Chess:54.344:18.646:https://i.pravatar.cc/400?img=21"
  "paulina.jankowska@test.com:password123:Paulina Jankowska:24:Nowa w Gdańsku, szukam znajomych do pubów:Junior Marketer:Piwo,Social,Dancing:54.362:18.642:https://i.pravatar.cc/400?img=11"
  "dawid.tomaszewski@test.com:password123:Dawid Tomaszewski:33:Piwo po pracy? Always yes!:Project Manager:Piwo,Sports,Cooking:54.349:18.656:https://i.pravatar.cc/400?img=22"
  "weronika.mazurek@test.com:password123:Weronika Mazurek:28:Exploring local breweries jeden weekend naraz:Travel Blogger:Piwo,Travel,Photography:54.357:18.637:https://i.pravatar.cc/400?img=23"
  "jakub.olszewski@test.com:password123:Jakub Olszewski:31:Certified Cicerone, beer is my passion:Sommelier:Piwo,Fine Dining,Wine:54.343:18.647:https://i.pravatar.cc/400?img=24"
  "patrycja.wozniak@test.com:password123:Patrycja Woźniak:26:Weekendowe wypady do nowych pubów - kto ze mną?:Photographer:Piwo,Photography,Nature:54.363:18.643:https://i.pravatar.cc/400?img=25"
  "mateusz.maciejewski@test.com:password123:Mateusz Maciejewski:29:IPA lover, zawsze otwarty na degustacje:UX Researcher:Piwo,Research,Psychology:54.350:18.657:https://i.pravatar.cc/400?img=26"
  "oliwia.kowalska@test.com:password123:Oliwia Kowalska:27:Piwo rzemieślnicze > komercyjne. Change my mind!:Barista:Piwo,Coffee,Indie Music:54.346:18.636:https://i.pravatar.cc/400?img=27"
  "daniel.szymanski@test.com:password123:Daniel Szymański:35:Veteran sceny kraftowej, znam każdy browar w okolicy:Consultant:Piwo,Business,Mentoring:54.364:18.644:https://i.pravatar.cc/400?img=28"
)

# Tablice do przechowywania tokenów i ID (zwykłe tablice zamiast associative)
declare -a USER_TOKENS
declare -a USER_IDS
declare -a USER_EMAILS

# Przykładowe wiadomości do chatu
declare -a MESSAGES=(
  "Hej! Widzę że lubisz takie same piwa jak ja! 🍺"
  "Cześć! Może jakaś degustacja w weekend?"
  "Hej, znasz jakieś dobre miejsca na piwo w okolicy?"
  "Witaj! Widziałeś ostatnio nowe piwo w X barze?"
  "Yo! Idziemy na browara?"
  "Cześć! Super że się zmatchowaliśmy! Lubisz IPAs?"
  "Hej! Może jakiś pub quiz przy piwie?"
  "Co słychać? Planujesz coś na piątek?"
  "Hej, polecasz jakieś dobre krafty?"
  "Witam! Nowa jesteś w mieście? Mogę pokazać najlepsze puby!"
  "Hej! Widzę że też pracujesz w IT, piwo po pracy? 😄"
  "Cześć! Super zdjęcie, na pewno masz dobry gust w piwie!"
  "Co tam? Może jakiś beer tasting w ten weekend?"
  "Hej! Znasz może jakieś nowe browary w okolicy?"
  "Witaj! Lubisz portery? Znam świetne miejsce!"
)

echo -e "${YELLOW}Phase 1: Creating users${NC}"
echo "====================================="
echo ""

# Funkcja do tworzenia użytkownika
create_user() {
  local index=$1
  local user_data="${USERS[$index]}"
  IFS=':' read -r email password name age bio occupation interests lat lng photo <<< "$user_data"

  echo -e "${BLUE}Creating user $((index + 1))/30: $name ($email)${NC}"

  # 1. Register user
  REGISTER_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$email\",\"password\":\"$password\"}")

  # Extract token and userId
  TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"userId":[0-9]*' | cut -d':' -f2)

  if [ -z "$TOKEN" ] || [ -z "$USER_ID" ]; then
    echo -e "  ${RED}❌ Failed to register user${NC}"
    echo "  Response: $REGISTER_RESPONSE"
    return 1
  fi

  # Store token, ID and email in arrays
  USER_TOKENS[$index]="$TOKEN"
  USER_IDS[$index]="$USER_ID"
  USER_EMAILS[$index]="$email"

  echo "  ✓ Registered (ID: $USER_ID)"

  # 2. Convert interests string to JSON array
  IFS=',' read -ra INTEREST_ARRAY <<< "$interests"
  INTERESTS_JSON="["
  for i in "${!INTEREST_ARRAY[@]}"; do
    if [ $i -gt 0 ]; then
      INTERESTS_JSON+=","
    fi
    INTERESTS_JSON+="\"${INTEREST_ARRAY[$i]}\""
  done
  INTERESTS_JSON+="]"

  # 3. Update profile
  UPDATE_RESPONSE=$(curl -s -X PUT "$BACKEND_URL/api/users/profile" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
      \"name\": \"$name\",
      \"age\": $age,
      \"bio\": \"$bio\",
      \"occupation\": \"$occupation\",
      \"interests\": $INTERESTS_JSON,
      \"profilePhoto\": \"$photo\",
      \"latitude\": $lat,
      \"longitude\": $lng
    }")

  if echo "$UPDATE_RESPONSE" | grep -q "\"name\":\"$name\""; then
    echo -e "  ${GREEN}✓ Profile updated${NC}"
  else
    echo -e "  ${YELLOW}⚠ Profile update may have failed${NC}"
  fi

  echo ""
}

# Create all users
for i in "${!USERS[@]}"; do
  create_user $i
  sleep 0.3
done

echo ""
echo -e "${YELLOW}Phase 2: Creating swipes and matches${NC}"
echo "====================================="
echo ""

# Funkcja do wykonania swipe
do_swipe() {
  local swiper_index=$1
  local swiped_index=$2
  local action=$3

  local token="${USER_TOKENS[$swiper_index]}"
  local swiped_id="${USER_IDS[$swiped_index]}"

  if [ -z "$token" ] || [ -z "$swiped_id" ]; then
    return 1
  fi

  SWIPE_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/swipes" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    -d "{\"swipedUserId\": $swiped_id, \"action\": \"$action\"}")

  echo "$SWIPE_RESPONSE"
}

# Predefiniowane pary matchów (indexed by array position, 0-based)
# Format: "swiper_index:swiped_index"
declare -a MATCH_PAIRS=(
  "0:1"   # Anna <-> Jan
  "0:3"   # Anna <-> Piotr
  "1:2"   # Jan <-> Ewa
  "2:5"   # Ewa <-> Tomasz
  "3:4"   # Piotr <-> Kasia
  "4:6"   # Kasia <-> Maria
  "5:7"   # Tomasz <-> Marek
  "6:8"   # Maria <-> Agata
  "7:9"   # Marek <-> Łukasz
  "8:9"   # Agata <-> Łukasz
)

echo "Creating matches..."
echo ""

# Tworzenie matchów
for pair in "${MATCH_PAIRS[@]}"; do
  IFS=':' read -r idx1 idx2 <<< "$pair"

  # Extract names for display
  name1=$(echo "${USERS[$idx1]}" | cut -d':' -f3)
  name2=$(echo "${USERS[$idx2]}" | cut -d':' -f3)

  echo -e "${BLUE}Creating match: $name1 <-> $name2${NC}"

  # First user likes second
  RESPONSE1=$(do_swipe "$idx1" "$idx2" "LIKE")
  echo "  → $name1 likes $name2"

  # Second user likes first (creates match)
  RESPONSE2=$(do_swipe "$idx2" "$idx1" "LIKE")

  if echo "$RESPONSE2" | grep -q '"isMatch":true'; then
    echo -e "  ${GREEN}✓ Match created!${NC}"
  elif echo "$RESPONSE2" | grep -q '"match":true'; then
    echo -e "  ${GREEN}✓ Match created!${NC}"
  else
    echo "  ✓ Swipes recorded"
  fi

  echo ""
  sleep 0.3
done

# Dodatkowe swipe'y bez matchów (PASS)
echo "Creating additional swipes (no matches)..."
echo ""

# Kilka przykładowych PASS swipe'ów
do_swipe "0" "5" "PASS" > /dev/null
echo "  → User 1 passed User 6"

do_swipe "1" "4" "PASS" > /dev/null
echo "  → User 2 passed User 5"

do_swipe "2" "6" "PASS" > /dev/null
echo "  → User 3 passed User 7"

echo ""

echo ""
echo -e "${YELLOW}Phase 3: Creating chat messages${NC}"
echo "====================================="
echo ""

# Funkcja do wysłania wiadomości
send_message() {
  local sender_index=$1
  local match_id=$2
  local content=$3

  local token="${USER_TOKENS[$sender_index]}"

  if [ -z "$token" ]; then
    return 1
  fi

  MESSAGE_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/messages" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    -d "{\"matchId\": $match_id, \"content\": \"$content\"}")

  echo "$MESSAGE_RESPONSE"
}

# Funkcja do pobrania matchów użytkownika
get_matches() {
  local user_index=$1
  local token="${USER_TOKENS[$user_index]}"

  if [ -z "$token" ]; then
    return 1
  fi

  MATCHES_RESPONSE=$(curl -s -X GET "$BACKEND_URL/api/matches" \
    -H "Authorization: Bearer $token")

  echo "$MATCHES_RESPONSE"
}

echo "Sending messages to matches..."
echo ""

# Dla pierwszych 10 użytkowników, pobierz ich matche i wyślij wiadomości
for i in {0..9}; do
  name=$(echo "${USERS[$i]}" | cut -d':' -f3)

  # Pobierz matche
  matches=$(get_matches "$i")

  # Extract match IDs
  match_ids=$(echo "$matches" | grep -o '"matchId":[0-9]*' | cut -d':' -f2)

  if [ -z "$match_ids" ]; then
    continue
  fi

  # Dla każdego matcha, wyślij 1-3 losowe wiadomości
  for match_id in $match_ids; do
    # Losowa liczba wiadomości (1-3)
    num_messages=$((RANDOM % 3 + 1))

    echo -e "${BLUE}$name sending messages to match $match_id${NC}"

    for ((j=0; j<num_messages; j++)); do
      # Wybierz losową wiadomość
      msg_idx=$((RANDOM % ${#MESSAGES[@]}))
      message="${MESSAGES[$msg_idx]}"

      # Wyślij wiadomość
      send_message "$i" "$match_id" "$message" > /dev/null
      echo "  → \"$message\""

      sleep 0.2
    done

    echo ""
  done
done

echo ""
echo "====================================="
echo -e "${GREEN}✅ Database seeded successfully!${NC}"
echo ""
echo "Summary:"
echo "  👥 Users created: ${#USER_EMAILS[@]}"
echo "  💕 Matches created: ${#MATCH_PAIRS[@]}"
echo "  💬 Messages sent: ~${#MATCH_PAIRS[@]} conversations"
echo "  🔄 Swipeable profiles: $((${#USER_EMAILS[@]} - 10))"
echo ""
echo "You can now login with:"
echo ""
for i in {0..4}; do
  name=$(echo "${USERS[$i]}" | cut -d':' -f3)
  email=$(echo "${USERS[$i]}" | cut -d':' -f1)
  echo "  📧 $name - $email"
  echo "     Password: password123"
  echo ""
done
echo "...and 25 more users!"
echo ""
echo "🍺 Start exploring BeerFinder!"
echo ""