"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { typeColors } from '../utils/typeColors';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


const PokemonDetails = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [pokemon, setPokemon] = useState(null);
  const [encounters, setEncounters] = useState([]);
  const [error, setError] = useState(null);
  const [damageRelations, setDamageRelations] = useState([]);
  const [abilities, setAbilities] = useState([]);

  // Helper function to format names (e.g., "vine-whip" → "Vine Whip")
  const formatName = (name) =>
    name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Fetch Pokémon data
  useEffect(() => {
    if (!id) return;

    const fetchPokemonDetails = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!res.ok) throw new Error("Failed to fetch Pokémon data");
        const data = await res.json();
        setPokemon(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  // Fetch type damage relations
  const fetchTypeDamageRelations = async (typeUrl) => {
    const res = await fetch(typeUrl);
    const typeData = await res.json();
    return typeData.damage_relations;
  };

  // Fetch ability description
  const fetchAbilityDescription = async (abilityUrl) => {
    const res = await fetch(abilityUrl);
    const abilityData = await res.json();
    
    // Find English short effect
    const englishEffect = abilityData.effect_entries.find(
      entry => entry.language.name === 'en' && entry.short_effect
    );
    
    return englishEffect ? englishEffect.short_effect : 'No ability description available.';
  };

  // Fetch encounter data when Pokémon is loaded
  useEffect(() => {
    if (!pokemon) return;

    const fetchEncounters = async () => {
      try {
        const res = await fetch(pokemon.location_area_encounters);
        if (!res.ok) throw new Error("Failed to fetch encounter data");
        const data = await res.json();
        setEncounters(data);
      } catch (err) {
        console.error(err);
        setEncounters([]); // Display "No data" if fetch fails
      }
    };

    const fetchDamageRelations = async () => {
      try {
        const relations = await Promise.all(
          pokemon.types.map(async (type) => {
            const typeRelations = await fetchTypeDamageRelations(type.type.url);
            return { type: type.type.name, relations: typeRelations };
          })
        );
        setDamageRelations(relations);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAbilities = async () => {
      try {
        const abilities = await Promise.all(
          pokemon.abilities.map(async (ability) => {
            const description = await fetchAbilityDescription(ability.ability.url);
            return { name: ability.ability.name, description };
          })
        );
        setAbilities(abilities);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEncounters();
    fetchDamageRelations();
    fetchAbilities();
  }, [pokemon]);

  


  // Group encounters by version
  const groupEncountersByVersion = (encounters) => {
    const grouped = {};
    encounters.forEach((encounter) => {
      encounter.version_details.forEach((versionDetail) => {
        const versionName = versionDetail.version.name;
        const locationName = encounter.location_area.name;
        if (!grouped[versionName]) grouped[versionName] = new Set();
        grouped[versionName].add(locationName);
      });
    });
    return Object.fromEntries(
      Object.entries(grouped).map(([key, value]) => [key, Array.from(value)])
    );
  };

  // Define possible learn methods
  const learnMethods = [
    "level-up",
    "machine",
    "tutor",
    "egg",
    "stadium-surfing-pikachu",
    "light-ball-egg",
    "colosseum-purification",
    "xd-shadow",
    "xd-purification",
    "form-change",
    "zygarde-cube",
  ];

  // Group moves by learn method
  const groupMovesByMethod = (moves) => {
    const grouped = {};
    learnMethods.forEach((method) => (grouped[method] = new Set()));
    moves.forEach((move) => {
      const moveName = move.move.name;
      move.version_group_details.forEach((detail) => {
        const method = detail.move_learn_method.name;
        if (learnMethods.includes(method)) grouped[method].add(moveName);
      });
    });
    return Object.fromEntries(
      Object.entries(grouped).map(([key, value]) => [key, Array.from(value)])
    );
  };

  if (!id) return <div className="text-center text-lg">No Pokémon ID provided</div>;
  if (error) return <div className="text-center text-lg text-red-500">Error: {error}</div>;
  if (!pokemon) return <div className="text-center text-lg">Loading...</div>;

  return (
    <main className="min-h-screen flex-grow container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side: Main Content */}
        <div className="flex flex-col space-y-8 md:w-2/3">
          {/* Locations Section */}
          <div>
            <h2 className="text-2xl font-semibold">Locations</h2>
            {encounters.length > 0 ? (
              <div>
                {Object.entries(groupEncountersByVersion(encounters)).map(
                  ([version, locations]) => (
                    <div key={version} className="mt-4">
                      <h3 className="text-xl font-medium">{formatName(version)}</h3>
                      <ul className="list-disc list-inside">
                        {locations.map((location, index) => (
                          <li key={index}>{formatName(location)}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p>No encounter data available.</p>
            )}
          </div>

          {/* Movesets Section */}
          <div>
            <h2 className="text-2xl font-semibold">Possible Movesets</h2>
            {Object.entries(groupMovesByMethod(pokemon.moves)).map(
              ([method, moves]) =>
                moves.length > 0 && (
                  <div key={method} className="mt-4">
                    <h3 className="text-xl font-medium">{formatName(method)} Moves</h3>
                    <ul className="flex flex-wrap gap-2">
                      {moves.map((move, index) => (
                        <li
                          key={index}
                          className="px-3 py-1 rounded-full bg-yellow-200 text-yellow-800"
                        >
                          {formatName(move)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </div>
        </div>

        {/* Right Side: Aside */}
        <div className="md:w-1/3">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center">{formatName(pokemon.name)}</h1>
            <p className="text-center text-lg">
              #{String(pokemon.id).padStart(3, "0")}
            </p>
            <div className="flex justify-center space-x-2 mt-2">
              {pokemon.types.map((type) => (
                <Popover key={type.type.name}>
                  <PopoverTrigger className={`${typeColors[type.type.name] || 'bg-gray-400'} text-white px-4 py-2 rounded-full  font-medium capitalize cursor-pointer hover:opacity-80`}>{type.type.name}</PopoverTrigger>
                  <PopoverContent className="text-sm font-medium">
                    <p><strong>Double Damage From:</strong> {damageRelations.find(d => d.type === type.type.name)?.relations.double_damage_from.map(d => d.name).join(', ') || 'None'}</p>
                    <p><strong>Double Damage To:</strong> {damageRelations.find(d => d.type === type.type.name)?.relations.double_damage_to.map(d => d.name).join(', ') || 'None'}</p>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
            <img
              src={pokemon.sprites.other["official-artwork"].front_default}
              alt={`Official artwork of ${pokemon.name}`}
              className="mx-auto mt-4"
            />
            <div className="mt-4">
              <h2 className="text-xl font-semibold">Abilities</h2>
              <ul className="flex flex-wrap justify-center gap-2 mt-2">
                {abilities.map((ability, index) => (
                  <li
                    key={index}
                  >
                    <Popover>
                      <PopoverTrigger className="capitalize text-md font-semibold cursor-pointer px-3 py-2 rounded-full bg-green-200 text-green-800   hover:opacity-80">{ability.name}</PopoverTrigger>
                      <PopoverContent className="text-sm font-medium">
                        {ability.description}
                      </PopoverContent>
                    </Popover>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-semibold">Stats</h2>
              <ul className="mt-2">
                {pokemon.stats.map((stat, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{formatName(stat.stat.name)}</span>
                    <span>{stat.base_stat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PokemonDetails;