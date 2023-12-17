import { Album } from './Album';
import { User } from './User';

export interface Photo {
  albumId: number,
  id: number,
  title: string,
  url: string,
  album: Album | undefined;
  user: User | undefined
}
