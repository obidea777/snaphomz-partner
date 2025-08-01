'use client';

import React, { useEffect, useRef, useState } from 'react';

import useGooglePlacesAutocomplete from 'lib/api/useGooglePlaces';
import { Input } from './input';
import { cn } from 'lib/utils';

type Props = Readonly<{
  className?: string;
  inputClassName?: string;
  value: string;
  setValue: (val: string) => void;
}>;

function MemoizedSpeechInput({
  className,
  value,
  setValue,
  inputClassName,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [placeholderText, setPlaceholderText] = useState('write address to claim');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const suggestions = useGooglePlacesAutocomplete(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e)
    setValue(e.currentTarget.value);
    setShowSuggestions(e.currentTarget.value.length > 1);
    setSelectedIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) =>
        prevIndex === null ? 0 : Math.min(suggestions.length - 1, prevIndex + 1)
      );
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) =>
        prevIndex === null ? 0 : Math.max(0, prevIndex - 1)
      );
    } else if (e.key === 'Enter' && selectedIndex !== null) {
      setValue(suggestions[selectedIndex]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setValue(`${value} ${suggestion}`);
    setShowSuggestions(false);
  };

  return (
    <div className={cn('relative w-1/2 ', className)}>
      <div className="flex h-12 w-full border items-center rounded-md bg-white pl-4">
        <Input
          ref={inputRef}
          placeholder={placeholderText}
          value={value}
          autoComplete="on"
        
          autoCorrect="on"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-1/2 border-none outline-none border  rounded-md',
            inputClassName
          )}
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-10 mt-1 max-h-52 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
          {suggestions.map((city, index) => (
            <li
              key={index}
              className={cn(
                'cursor-pointer text-left  px-4 py-2 hover:bg-gray-100',
                selectedIndex === index && 'bg-blue-100'
              )}
              onClick={() => handleSuggestionClick(city)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const PropertySearch = React.memo(MemoizedSpeechInput);

export default PropertySearch;
