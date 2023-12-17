import { Dispatch, SetStateAction } from 'react';
import { User } from '../../types';

type Props = {
  users: User[];
  userId: number;
  onChangeCallback: Dispatch<SetStateAction<number>>;
};

export const UserFiltersPanel = ({
  users, userId, onChangeCallback,
} : Props) => {
  const handleClick = (id:number) => () => {
    if (id === 0) {
      onChangeCallback(0);

      return;
    }

    onChangeCallback(id);
  };

  return (
    <p className="panel-tabs has-text-weight-bold">
      <a
        data-cy="FilterAllUsers"
        href="#/"
        className={userId === 0 ? 'is-active' : ''}
        onClick={handleClick(0)}
      >
        All
      </a>

      {users.map((user : User) => (
        <a
          data-cy="FilterUser"
          href="#/"
          key={user.id}
          className={userId === user.id ? 'is-active' : ''}
          onClick={handleClick(user.id)}
        >
          {user.name}
        </a>
      ))}
    </p>
  );
};
