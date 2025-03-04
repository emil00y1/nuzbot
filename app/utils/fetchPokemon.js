import { generationRanges } from './generationRanges';

export const fetchPokemon = async (limit = 20, offset = 0, generation = 1) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  const data = await response.json();

  // More robust ID extraction using regex
  const extractPokemonId = (url) => {
    const match = url.match(/\/(\d+)\//);
    return match ? parseInt(match[1]) : null;
  };

  // Filter Pokémon based on the selected generation
  const [start, end] = generationRanges[generation] || [1, 151];
  const filteredPokemonUrls = data.results.filter(pokemon => {
    const pokemonId = extractPokemonId(pokemon.url);
    return pokemonId !== null && pokemonId >= start && pokemonId <= end;
  });

  // Fetch full details for each filtered Pokemon
  const pokemonDetails = await Promise.all(
    filteredPokemonUrls.map(async (pokemon) => {
      const detailResponse = await fetch(pokemon.url);
      return detailResponse.json();
    })
  );

  return pokemonDetails;
};