'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';

export interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounce?: number;
  className?: string;
  showButton?: boolean;
}

const SearchBar = ({
  placeholder = 'Rechercher...',
  onSearch,
  debounce = 300,
  className,
  showButton = false,
}: SearchBarProps) => {
  const [value, setValue] = useState('');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set new timeout for debounced search
      const newTimeoutId = setTimeout(() => {
        onSearch(newValue);
      }, debounce);

      setTimeoutId(newTimeoutId);
    },
    [onSearch, debounce, timeoutId]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    onSearch(value);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-10 pr-10"
          fullWidth
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
            aria-label="Effacer"
          >
            ×
          </button>
        )}
      </div>
      {showButton && (
        <Button type="submit" size="md">
          Rechercher
        </Button>
      )}
    </form>
  );
};

SearchBar.displayName = 'SearchBar';

export { SearchBar };
