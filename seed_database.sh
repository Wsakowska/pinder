#!/bin/bash

echo "🍺 BeerFinder - Seed Database Script"
echo "====================================="
echo ""

BACKEND_URL="http://localhost:8080"

# Kolory dla outputu
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Tablica użytkowników do stworzenia
declare -a USERS=(
  "anna.kowalska@test.com:password123:Anna Kowalska:28:Lubię piwo kraftowe i IPAs:Software Developer:Piwo,Muzyka,Podróże:https://randomuser.me/api/portraits/women/1.jpg"
  "jan.nowak@test.com:password123:Jan Nowak:32:Fan stoutów i portów:Product Manager:Piwo,Gaming,Sport:https://randomuser.me/api/portraits/men/2.jpg"
  "ewa.wisniewski@test.com:password123:Ewa Wiśniewska:25:Miłośniczka piw belgijskich:UX Designer:Piwo,Sztuka,Joga:https://randomuser.me/api/portraits/women/3.jpg"
  "piotr.zielinski@test.com:password123:Piotr Zieliński:30:Piwo to życie!:DevOps Engineer:Piwo,Technologia,Fotografia:https://randomuser.me/api/portraits/men/4.jpg"
  "kasia.nowacka@test.com:password123:Kasia Nowacka:27:Kocham piwa pszeniczne:Marketing Specialist:Piwo,Fashion,Travel:https://randomuser.me/api/portraits/women/5.jpg"
  "tomasz.wojcik@test.com:password123:Tomasz Wójcik:29:Craft beer enthusiast:Backend Developer:Piwo,Coding,Music:https://randomuser.me/api/portraits/men/6.jpg"
  "maria.dabrowska@test.com:password123:Maria Dąbrowska:26:Lubię eksperymentować z piwem:Data Scientist:Piwo,Books,Hiking:https://randomuser.me/api/portraits/women/7.jpg"
  "marek.lewandowski@test.com:password123:Marek Lewandowski:31:Wielbiciel piw regionalnych:Sales Manager:Piwo,Fishing,Cars:https://randomuser.me/api/portraits/men/8.jpg"
  "agata.kaminska@test.com:password123:Agata Kamińska:24:Rozpoczynam przygodę z piwem:Junior Developer:Piwo,Anime,Cooking:https://randomuser.me/api/portraits/women/9.jpg"
  "lukasz.kowalczyk@test.com:password123:Łukasz Kowalczyk:33:Piwo i przyjaciele - idealne combo:Architect:Piwo,Design,Photography:https://randomuser.me/api/portraits/men/10.jpg"
)

echo "Creating ${#USERS[@]} test users..."
echo ""

# Funkcja do tworzenia użytkownika
create_user() {
  local user_data=$1
  IFS=':' read -r email password name age bio occupation interests photo <<< "$user_data"
  
  echo -e "${BLUE}Creating user: $name ($email)${NC}"
  
  # 1. Register user
  REGISTER_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$email\",\"password\":\"$password\"}")
  
  # Extract token
  TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  
  if [ -z "$TOKEN" ]; then
    echo "  ❌ Failed to register user"
    echo "  Response: $REGISTER_RESPONSE"
    return 1
  fi
  
  echo "  ✓ Registered"
  
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
      \"profilePhoto\": \"$photo\"
    }")
  
  if echo "$UPDATE_RESPONSE" | grep -q "\"name\":\"$name\""; then
    echo -e "  ${GREEN}✓ Profile updated${NC}"
  else
    echo "  ⚠ Profile update may have failed"
    echo "  Response: $UPDATE_RESPONSE"
  fi
  
  echo ""
}

# Create all users
for user in "${USERS[@]}"; do
  create_user "$user"
  sleep 0.5  # Small delay to avoid overwhelming the server
done

echo "====================================="
echo -e "${GREEN}✅ Database seeded successfully!${NC}"
echo ""
echo "You can now:"
echo "  1. Login with any of these credentials:"
echo "     - anna.kowalska@test.com / password123"
echo "     - jan.nowak@test.com / password123"
echo "     - etc..."
echo ""
echo "  2. Start swiping! 🍺"
echo ""
