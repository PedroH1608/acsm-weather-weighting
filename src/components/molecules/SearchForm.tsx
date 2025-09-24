import React from 'react';

interface Props {
  location: string;
  onLocationChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export function SearchForm({ location, onLocationChange, onSearch, isLoading }: Props) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div>
      <input
        type="text"
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter location"
        disabled={isLoading}
      />
      <button onClick={onSearch} disabled={isLoading}>
        {isLoading ? "Loading..." : "Get Weather"}
      </button>
    </div>
  );
}