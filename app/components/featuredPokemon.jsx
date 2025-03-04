import Image from 'next/image';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Server Component
async function getFeaturedPokemon() {
  // Get a random Pokémon ID (1-898)
  const randomId = Math.floor(Math.random() * 898) + 1;
  
  // Fetch the Pokémon data
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  const pokemonData = await res.json();
  
  // Fetch species data for description
  const speciesRes = await fetch(pokemonData.species.url);
  const speciesData = await speciesRes.json();
  
  // Fetch ability description
  let abilityDescription = 'No ability description available.';
  if (pokemonData.abilities.length > 0) {
    const abilityRes = await fetch(pokemonData.abilities[0].ability.url);
    const abilityData = await abilityRes.json();
    
    // Find English short effect
    const englishEffect = abilityData.effect_entries.find(
      entry => entry.language.name === 'en' && entry.short_effect
    );
    
    if (englishEffect) {
      abilityDescription = englishEffect.short_effect;
    }
  }
  
  // Find English flavor text
  const englishFlavorText = speciesData.flavor_text_entries.find(
    entry => entry.language.name === 'en'
  );
  
  return {
    ...pokemonData,
    description: englishFlavorText 
      ? englishFlavorText.flavor_text.replace(/[\n\f]/g, ' ') 
      : 'No description available.',
    abilityDescription
  };
}

export default async function FeaturedPokemon() {
  const featured = await getFeaturedPokemon();

  return (
    <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl overflow-hidden shadow-lg">
      <div className="relative p-6 md:p-8">
        <div className="absolute top-0 right-0 bg-white bg-opacity-20 rounded-bl-xl py-1 px-3">
          <span className=" font-semibold text-zinc-700">Featured Pokémon</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
          <div className="md:col-span-2 relative h-48 md:h-64">
            <Image
              src={featured.sprites.other['official-artwork'].front_default || featured.sprites.front_default}
              alt={featured.name}
              width={500}
              height={500}
              className="drop-shadow-2xl w-full h-full object-contain"
              priority
            />
          </div>
          
          <div className="md:col-span-3 text-white">
            <div className="flex items-baseline mb-2">
              <h2 className="text-3xl md:text-4xl font-bold capitalize mr-3">{featured.name}</h2>
              <span className="text-xl opacity-80">#{featured.id.toString().padStart(3, '0')}</span>
            </div>
            
            <div className="flex gap-2 mb-4">
              {featured.types.map((type) => (
                <span
                  key={type.type.name}
                  className={`bg-${type.type.name} text-white bg-opacity-30 px-3 py-1 rounded-full text-sm font-medium capitalize`}
                >
                  {type.type.name}
                </span>
              ))}
            </div>
            
            <p className="mb-6 text-lg leading-relaxed">{featured.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <h4 className="text-white text-opacity-70 text-sm">Height</h4>
                <p className="text-lg font-semibold">{featured.height / 10} m</p>
              </div>
              <div>
                <h4 className="text-white text-opacity-70 text-sm">Weight</h4>
                <p className="text-lg font-semibold">{featured.weight / 10} kg</p>
              </div>
              <div>
                <h4 className="text-white text-opacity-70 text-sm">Base Exp</h4>
                <p className="text-lg font-semibold">{featured.base_experience}</p>
              </div>
              <div>
                <h4 className="text-white text-opacity-70 text-sm">Abilities</h4>
                <Popover>
                  <PopoverTrigger className="capitalize text-lg font-semibold cursor-pointer hover:opacity-80">{featured.abilities[0].ability.name}</PopoverTrigger>
                  <PopoverContent className="text-sm font-medium">
                    {featured.abilityDescription}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <Link href={`/pokemon?id=${featured.id}`} className="bg-white text-blue-600 hover:bg-blue-100 transition-colors px-6 py-2 rounded-full font-semibold inline-block">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}