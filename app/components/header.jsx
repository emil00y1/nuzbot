'use client';

import { useState, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GenerationContext } from '../contexts/generationContext'; // Import GenerationContext

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { generation, setGeneration } = useContext(GenerationContext); // Use GenerationContext

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleGenerationChange = (event) => {
    // Get the numeric value from the selected option
    const selectedGeneration = event.target.value;
    setGeneration(selectedGeneration);
    
    // Store only the number in localStorage
    localStorage.setItem('generation', selectedGeneration);
  };

  return (
    <header className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center cursor-pointer">
            <div className="relative h-10 w-10 place-content-center">
              <Image 
                src="/poke-egg.png" 
                alt="PokéWiki Logo" 
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold text-white">Nuzbot</span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Generation Select Dropdown */}
           <select
            value={generation || 1} // Ensure it always has a valid value
            onChange={handleGenerationChange}
            className="bg-white text-gray-800 py-2 px-4 rounded"
          >
            {[...Array(9).keys()].map((gen) => (
              <option key={gen + 1} value={gen + 1}>
                Generation {gen + 1}
              </option>
            ))}
          </select>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-white hover:text-gray-200 transition-colors">Home</Link>
              <Link href="/pokedex" className="text-white hover:text-gray-200 transition-colors">Pokédex</Link>
              <Link href="/types" className="text-white hover:text-gray-200 transition-colors">Types</Link>
              <Link href="/regions" className="text-white hover:text-gray-200 transition-colors">Regions</Link>
              <Link href="/about" className="text-white hover:text-gray-200 transition-colors">About</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;