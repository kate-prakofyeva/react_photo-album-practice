import { Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';
import { Album } from '../../types';

type Props = {
  albums: Album[];
  albumIds: (number | undefined)[];
  onChangeCallback: Dispatch<SetStateAction<(number | undefined)[]>>;
};

export const AlbumFiltersPanel = ({
  albums, albumIds, onChangeCallback,
} : Props) => {
  const handleClick = (id : number) => () => {
    if (id === 0) {
      onChangeCallback([]);

      return;
    }

    const filter = albums.find(album => album.id === id);

    onChangeCallback(prev => [...prev, filter?.id]);
  };

  return (
    <div className="panel-block is-flex-wrap-wrap">
      <a
        data-cy="FilterAllUsers"
        href="#/"
        className={classNames({
          'button is-success mr-6': true,
          'is-outlined': albumIds?.length,
        })}
        onClick={handleClick(0)}
      >
        All
      </a>

      {albums && albums.map(album => (
        <a
          data-cy="FilterUser"
          href="#/"
          key={album.id}
          className={classNames({
            'button mr-2 my-1': true,
            'is-info': albumIds?.includes(album.id),
          })}
          onClick={handleClick(album.id)}
        >
          <p
            style={{
              width: '100px', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
          >
            {album.title}
          </p>
        </a>
      ))}
    </div>
  );
};
