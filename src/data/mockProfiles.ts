// src/data/mockProfiles.ts
import type { Profile } from '../types/profile';

export const mockProfiles: Profile[] = [
  {
    id: 1,
    name: "Kasia",
    age: 28,
    bio: "Lubię IPA i długie spacery po lesie. Szukam kogoś na piwo przy zachodzie słońca.",
    occupation: "Grafik",
    interests: ["IPA", "Psy", "Wspinaczka", "Podcasty"],
    profilePhoto: "https://randomuser.me/api/portraits/women/44.jpg",
    distance: 2.3
  },
  {
    id: 2,
    name: "Marek",
    age: 32,
    bio: "Piwo kraftowe to moja pasja. Gram na gitarze i robię domowe piwo.",
    occupation: "Programista",
    interests: ["Stout", "Gitara", "Piwo domowe", "Góry"],
    profilePhoto: "https://randomuser.me/api/portraits/men/32.jpg",
    distance: 5.1
  },
  {
    id: 3,
    name: "Ola",
    age: 25,
    bio: "Lager w ręku, słońce na twarzy. Szukam kogoś na spontaniczne wypady.",
    occupation: "Studentka",
    interests: ["Lager", "Plaża", "Taniec", "Kawa"],
    profilePhoto: "https://randomuser.me/api/portraits/women/68.jpg",
    distance: 1.8
  }
];