import React, { useEffect, useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import { albumsFromServer, photosFromServer, usersFromServer } from './api';

import {
  AlbumFiltersPanel,
  PhotoList,
  ResetButton,
  SearchBar,
  UserFiltersPanel,
} from './components';

import {
  Album, Direction, MoveType, Photo, SortType, User,
} from './types';

export const photos : Photo[] = photosFromServer.map(photo => {
  const album : Album | undefined = albumsFromServer
    .find(a => a.id === photo.albumId);
  const user : User | undefined = usersFromServer
    .find(u => u.id === album?.userId);

  return { ...photo, album, user };
});

export const App: React.FC = () => {
  const [visiblePhotos, setVisiblePhotos] = useState<Photo[]>(photos);
  const [userId, setUserId] = useState<number>(0);
  const [query, setQuery] = useState<string>('');
  const [albumIds, setAlbumIds] = useState<(number | undefined)[]>([]);
  const [sortBy, setSortBy] = useState<string>(SortType.Id);
  const [reversed, setReversed] = useState<boolean>(false);
  const [move, setMove] = useState<MoveType | null>(null);

  const filteredByName = (data : Photo[]) => {
    if (userId === 0) {
      return data;
    }

    return data.filter(photo => photo.user?.id === userId);
  };

  const filteredByQuery = (data : Photo[]) => (
    data.filter(photo => (
      photo.title.toLowerCase().includes(query.toLowerCase())
    ))
  );

  const filteredByAlbums = (data : Photo[]) => {
    if (!albumIds.length) {
      return data;
    }

    return data.filter(photo => albumIds.includes(photo.album?.id));
  };

  const resetAllFilters = () => {
    setUserId(0);
    setQuery('');
    setAlbumIds([]);
  };

  const handleTableSort = (field : string) => () => {
    if (sortBy !== field) {
      setSortBy(field);
      setReversed(false);
    } else if (!reversed) {
      setReversed(true);
    } else {
      setSortBy(SortType.Id);
      setReversed(false);
    }
  };

  const sortPhotos = (data : Photo[]) => {
    const sortedPhotos = [...data];

    sortedPhotos.sort((p1, p2) => {
      switch (sortBy) {
        case SortType.Id:
          return p1.id - p2.id;

        case SortType.Title:
          return p1.title.localeCompare(p2.title);

        case SortType.Album: {
          const a1Title = p1.album?.title || '';
          const a2Title = p2.album?.title || '';

          return a1Title.localeCompare(a2Title);
        }

        case SortType.User: {
          const u1Name = p1.user?.name || '';
          const u2Name = p2.user?.name || '';

          return u1Name.localeCompare(u2Name);
        }

        default:
          return 0;
      }
    });

    return sortedPhotos;
  };

  const reverse = (data : Photo[]) => {
    const reversedPhotos = [...data];

    if (reversed) {
      reversedPhotos.reverse();
    }

    return reversedPhotos;
  };

  const moveWithDirection = () => {
    const index = visiblePhotos.findIndex(photo => photo.id === move?.id);

    if (move?.direction === Direction.UP) {
      if (index <= 0) {
        return visiblePhotos;
      }

      const updatedPhotos : Photo[] = [
        ...visiblePhotos.slice(0, index - 1),
        visiblePhotos[index],
        visiblePhotos[index - 1],
        ...visiblePhotos.slice(index + 1),
      ];

      return updatedPhotos;
    }

    if (move?.direction === Direction.DOWN) {
      if (index >= visiblePhotos.length - 1) {
        return visiblePhotos;
      }

      const updatedPhotos : Photo[] = [
        ...visiblePhotos.slice(0, index),
        visiblePhotos[index + 1],
        visiblePhotos[index],
        ...visiblePhotos.slice(index + 2),
      ];

      return updatedPhotos;
    }

    return visiblePhotos;
  };

  useEffect(() => {
    let result = [...photos];

    result = filteredByName(result);
    result = filteredByQuery(result);
    result = filteredByAlbums(result);
    result = sortPhotos(result);
    result = reverse(result);
    setVisiblePhotos(result);
  }, [query, userId, albumIds, sortBy, reversed]);

  useEffect(() => {
    setVisiblePhotos(moveWithDirection());
  }, [move]);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Photos from albums</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <UserFiltersPanel
              users={usersFromServer}
              onChangeCallback={setUserId}
              userId={userId}
            />

            <SearchBar query={query} onChangeCallback={setQuery} />

            <AlbumFiltersPanel
              albums={albumsFromServer}
              onChangeCallback={setAlbumIds}
              albumIds={albumIds}
            />

            <ResetButton onChangeCallback={resetAllFilters} />

          </nav>
        </div>

        <div className="box table-container">
          {!visiblePhotos.length
            ? (
              <p data-cy="NoMatchingMessage">
                No photos matching selected criteria
              </p>
            )
            : (
              <table
                className="table is-striped is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID
                        <a
                          href="#/"
                          onClick={handleTableSort('id')}
                        >
                          <span
                            className={classNames('fas', {
                              'fa-sort': sortBy !== 'id',
                              'fa-sort-up': sortBy === 'id' && !reversed,
                              'fa-sort-down': sortBy === 'id' && reversed,
                            })}
                            style={{ marginLeft: '8px' }}
                          />
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Photo name

                        <a
                          href="#/"
                          onClick={handleTableSort('title')}
                        >
                          <span
                            className={classNames('fas', {
                              'fa-sort': sortBy !== 'title',
                              'fa-sort-up': sortBy === 'title' && !reversed,
                              'fa-sort-down': sortBy === 'title' && reversed,
                            })}
                            style={{ marginLeft: '8px' }}
                          />
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Album name

                        <a
                          href="#/"
                          onClick={handleTableSort('album')}
                        >
                          <span
                            className={classNames('fas', {
                              'fa-sort': sortBy !== 'album',
                              'fa-sort-up': sortBy === 'album' && !reversed,
                              'fa-sort-down': sortBy === 'album' && reversed,
                            })}
                            style={{ marginLeft: '8px' }}
                          />
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User name

                        <a
                          href="#/"
                          onClick={handleTableSort('user')}
                        >
                          <span
                            className={classNames('fas', {
                              'fa-sort': sortBy !== 'user',
                              'fa-sort-up': sortBy === 'user' && !reversed,
                              'fa-sort-down': sortBy === 'user' && reversed,
                            })}
                            style={{ marginLeft: '8px' }}
                          />
                        </a>
                      </span>
                    </th>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Up
                      </span>
                    </th>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Down
                      </span>
                    </th>
                  </tr>
                </thead>
                <PhotoList
                  photos={visiblePhotos}
                  onChangeCallback={setMove}
                />
              </table>
            )}
        </div>
      </div>
    </div>
  );
};
