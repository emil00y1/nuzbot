'use client';

import { useState, useEffect, useContext } from 'react';
import { GenerationContext } from '../contexts/generationContext';
import PokemonCard from './pokemonCard';
import { fetchPokemon } from '../utils/fetchPokemon';

const PokemonGrid = () => {
  const { generation } = useContext(GenerationContext);
  const [pokemon, setPokemon] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch Pokémon when the component loads or when the generation changes
  useEffect(() => {
    const loadPokemon = async () => {
      setLoading(true);
      const newPokemon = await fetchPokemon(20, 0, generation);
      setPokemon(newPokemon);
      setPage(0);
      setLoading(false);
    };

    loadPokemon();
  }, [generation]); // Re-fetch Pokémon whenever the generation changes

  const loadMorePokemon = async () => {
    setLoading(true);
    const newPokemon = await fetchPokemon(20, (page + 1) * 20, generation);
    setPokemon((prev) => [...prev, ...newPokemon]);
    setPage((prev) => prev + 1);
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Loading Pokémon...</p>
        </div>
      ) : pokemon.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pokemon.map((p) => (
              <PokemonCard 
                key={p.name} 
                pokemon={p} 
              />
            ))}
          </div>
          <div className="text-center py-6">
            <button
              onClick={loadMorePokemon}
              className="bg-blue-600 text-white px-4 py-2 rounded-full"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            No Pokémon found for Generation {generation}.
          </p>
        </div>
      )}
    </>
  );
};

export default PokemonGrid;
