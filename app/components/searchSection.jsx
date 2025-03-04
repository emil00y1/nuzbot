'use client';

import { usePokemon } from '../contexts/pokemonContext';
import SearchBar from './searchBar';

const SearchSection = () => {
  const { handleTypeFilter, currentType } = usePokemon();

  const typeButtons = [
    'all',
    'fire',
    'water',
    'grass',
    'electric',
    'psychic',
    'fighting'
  ];

  return (
    <div>
      <SearchBar />
      
      <div className="mt-4 flex flex-wrap gap-2">
        {typeButtons.map(type => (
          <button 
            key={type}
            onClick={() => handleTypeFilter(type)}
            className={`px-4 py-2 rounded-full text-sm capitalize ${
              currentType === type 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {type === 'all' ? 'All Types' : type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchSection;