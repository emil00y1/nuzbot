'use client';

import { useState } from 'react';
import { usePokemon } from '../contexts/pokemonContext';

const SearchBar = () => {
  const { handleSearch } = usePokemon();
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchInput);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Search Pokémon by name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full p-3 pl-10 text-gray-700 bg-gray-100 border-2 border-transparent rounded-full focus:outline-none focus:border-blue-500 transition-colors"
        />
        <div className="absolute left-3">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="w-5 h-5 text-gray-500"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        <button
          type="submit"
          className="absolute right-3 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="w-5 h-5"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14 5l7 7m0 0l-7 7m7-7H3" 
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;