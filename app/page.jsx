import FeaturedPokemon from "./components/featuredPokemon";
import Footer from "./components/footer";
import Header from "./components/header";
import PokemonGrid from "./components/pokemonGrid";
import SearchSection from "./components/searchSection";
import { PokemonProvider } from "./contexts/pokemonContext";
import { GenerationProvider } from "./contexts/generationContext"; // Import GenerationProvider
import { fetchPokemon } from "./utils/fetchPokemon";

// Server component
export default async function Home() {
  const initialPokemon = await fetchPokemon();

  return (
    <GenerationProvider> {/* Wrap with GenerationProvider */}
      <PokemonProvider initialPokemon={initialPokemon}>
          <main className="min-h-screen flex-grow container mx-auto px-4 py-8">
            <section className="mb-12">
              <FeaturedPokemon />
            </section>
            <section className="mb-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Explore Pokémon</h2>
              <SearchSection />
            </section>

            <section>
              <PokemonGrid />
            </section>
          </main>
      </PokemonProvider>
    </GenerationProvider>
  );
}