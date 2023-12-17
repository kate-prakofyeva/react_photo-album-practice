import { Dispatch, SetStateAction } from 'react';
import { Direction, MoveType, Photo } from '../../types';

type Props = {
  photo: Photo,
  onChangeCallback: Dispatch<SetStateAction<MoveType | null>>;
};

export const PhotoItem = ({ photo, onChangeCallback } : Props) => {
  const {
    id, title, album, user,
  } = photo;

  const handleClick = (selectedId : number, direction : Direction) => () => {
    if (selectedId === 0) {
      const move = {
        id: 0,
        direction: Direction.UP,
      };

      onChangeCallback(move);

      return;
    }

    const move = {
      id: selectedId,
      direction,
    };

    onChangeCallback(move);
  };

  return (
    <tr>
      <td className="has-text-weight-bold">
        {id}
      </td>

      <td>{title}</td>
      <td>{album?.title}</td>

      <td
        className={user?.sex === 'm' ? 'has-text-link' : 'has-text-danger'}
      >
        {user?.name}
      </td>
      <td>
        <button
          type="button"
          onClick={handleClick(id, Direction.UP)}
          className="button is-small is-success"
        >
          &#8593;
        </button>
      </td>
      <td>
        <button
          type="button"
          onClick={handleClick(id, Direction.DOWN)}
          className="button is-small is-info"
        >
          &#x2193;
        </button>
      </td>
    </tr>
  );
};
