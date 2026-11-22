import css from './SearchBox.module.css';

interface SearchBoxProps {
  search: string;
  setSearch: (value: string) => void;
}

const SearchBox = ({ search, setSearch }: SearchBoxProps) => {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={search}
      onChange={e => setSearch(e.target.value)}
    />
  );
};

export default SearchBox;
