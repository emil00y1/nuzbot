'use client';

import { createContext, useContext, useState } from 'react';

const PokemonContext = createContext(null);

export function PokemonProvider({ children, initialPokemon }) {
  const [pokemon] = useState(initialPokemon);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentType, setCurrentType] = useState('all');

  // Filter pokemon based on search term and type
  const filteredPokemon = pokemon.filter((p) => {
    // Filter by search term
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by type
    const matchesType = 
      currentType === 'all' || 
      p.types.some(t => t.type.name === currentType);
    
    return matchesSearch && matchesType;
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleTypeFilter = (type) => {
    setCurrentType(type);
  };

  return (
    <PokemonContext.Provider 
      value={{ 
        pokemon,
        filteredPokemon,
        searchTerm,
        currentType,
        handleSearch,
        handleTypeFilter
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
}

export function usePokemon() {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error('usePokemon must be used within a PokemonProvider');
  }
  return context;
}