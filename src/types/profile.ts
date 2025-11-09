export interface Profile {
  id: number;
  name: string;
  age: number;
  bio: string;
  occupation: string;
  interests: string[];
  profilePhoto?: string;
  distance: number;
}