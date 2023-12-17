import { Dispatch, SetStateAction } from 'react';
import { MoveType, Photo } from '../../types';
import { PhotoItem } from '../PhotoItem';

type Props = {
  photos: Photo[],
  onChangeCallback: Dispatch<SetStateAction<MoveType | null>>
};

export const PhotoList = ({ photos, onChangeCallback } : Props) => (
  <tbody>
    {
      photos.map(photo => (
        <PhotoItem
          key={photo.id}
          photo={photo}
          onChangeCallback={onChangeCallback}
        />
      ))
    }
  </tbody>
);
