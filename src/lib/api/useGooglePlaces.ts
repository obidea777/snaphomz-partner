import { useEffect, useState } from 'react';

const useGooglePlacesAutocomplete = (input: string) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [debouncedInput, setDebouncedInput] = useState('');
  const getLastWord = (text: string) => {
    const words = text.trim().split(/\s+/);
    return words[words.length - 1] || '';
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      const lastWord = getLastWord(input);
      setDebouncedInput(lastWord);
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  console.log(window.google?.maps)

  useEffect(() => {
    if (!debouncedInput || debouncedInput.length < 2 || typeof window === 'undefined') {
      setSuggestions([]);
      return;
    }
    if (!window.google) {
      return;
    }
    const autocompleteService = new window.google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions(
      { input: debouncedInput, 
        // types: ['(cities)'] ,
        componentRestrictions: { country: 'us' },
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions.map((p) => p.description));
        } else {
          setSuggestions([]);
        }
      }
    );
  }, [debouncedInput]);

  return suggestions;
};

export default useGooglePlacesAutocomplete;
