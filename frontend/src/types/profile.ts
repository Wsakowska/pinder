export interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  occupation: string;
  interests: string[];
  profilePhoto?: string;
  distance: number;
  likedUs?: boolean;
}