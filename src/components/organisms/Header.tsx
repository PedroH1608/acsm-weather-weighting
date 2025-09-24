import { SearchForm } from '../molecules/SearchForm';

interface Props {
  title: string;
  location: string;
  onLocationChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export function Header({ title, location, onLocationChange, onSearch, isLoading }: Props) {
  return (
    <header>
      <h1>{title}</h1>
      <SearchForm
        location={location}
        onLocationChange={onLocationChange}
        onSearch={onSearch}
        isLoading={isLoading}
      />
    </header>
  );
}