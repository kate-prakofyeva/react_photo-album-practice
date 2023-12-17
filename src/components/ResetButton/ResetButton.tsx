type Props = {
  onChangeCallback: () => void
};

export const ResetButton = ({ onChangeCallback } : Props) => (
  <div className="panel-block">
    <a
      href="#/"
      className="button is-link is-outlined is-fullwidth"
      onClick={onChangeCallback}
    >
      Reset all filters
    </a>
  </div>
);
