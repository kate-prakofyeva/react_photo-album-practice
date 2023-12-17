import { Dispatch, SetStateAction } from 'react';

type Props = {
  query: string;
  onChangeCallback: Dispatch<SetStateAction<string>>;
};

export const SearchBar = ({ query, onChangeCallback } : Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    onChangeCallback(inputValue);
  };

  const resetInput = () => {
    onChangeCallback('');
  };

  return (
    <div className="panel-block">
      <p className="control has-icons-left has-icons-right">
        <input
          type="text"
          className="input"
          placeholder="Search"
          value={query}
          onChange={handleChange}
        />

        <span className="icon is-left">
          <i className="fas fa-search" aria-hidden="true" />
        </span>

        {query && (
          <span className="icon is-right">
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button
              type="button"
              className="delete"
              onClick={resetInput}
            />
          </span>
        )}
      </p>
    </div>
  );
};
