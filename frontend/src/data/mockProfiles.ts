// src/data/mockProfiles.ts
import type { Profile } from '../types/profile.ts';

export const mockProfiles: Profile[] = [
  {
    id: '1',
    name: "Kasia",
    age: 28,
    bio: "Lubię IPA i długie spacery po lesie. Szukam kogoś na piwo przy zachodzie słońca.",
    occupation: "Grafik",
    interests: ["IPA", "Psy", "Wspinaczka", "Podcasty"],
    profilePhoto: "https://randomuser.me/api/portraits/women/44.jpg",
    distance: 2.3,
    likedUs: true
  },
  {
    id: '2',
    name: "Marek",
    age: 32,
    bio: "Piwo kraftowe to moja pasja. Gram na gitarze i robię domowe piwo.",
    occupation: "Programista",
    interests: ["Stout", "Gitara", "Piwo domowe", "Góry"],
    profilePhoto: "https://randomuser.me/api/portraits/women/45.jpg",
    distance: 5.1,
    likedUs: false
  },
  {
    id: '3',
    name: "Ola",
    age: 25,
    bio: "Lager w ręku, słońce na twarzy. Szukam kogoś na spontaniczne wypady.",
    occupation: "Studentka",
    interests: ["Lager", "Plaża", "Taniec", "Kawa"],
    profilePhoto: "https://randomuser.me/api/portraits/women/68.jpg",
    distance: 1.8,
    likedUs: true
  },
  {
    id: '4',
    name: "Dominik",
    age: 29,
    bio: "Passion for craft beers and outdoor adventures. Let's explore breweries together!",
    occupation: "Designer",
    interests: ["Pilsner", "Hiking", "Cooking", "Music"],
    profilePhoto: "https://randomuser.me/api/portraits/men/50.jpg",
    distance: 3.5,
    likedUs: false
  }
];