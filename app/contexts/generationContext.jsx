'use client';

import { createContext, useState, useEffect } from 'react';

export const GenerationContext = createContext();

export const GenerationProvider = ({ children }) => {
  const [generation, setGeneration] = useState(1); // Default to Generation 1

  useEffect(() => {
    // Check if window is available to access localStorage
    const storedGeneration = localStorage.getItem('generation');
    if (storedGeneration) {
      setGeneration(parseInt(storedGeneration));
    }
  }, []);

  useEffect(() => {
    // Store the generation in localStorage whenever it changes
    if (generation) {
      localStorage.setItem('generation', generation);
    }
  }, [generation]);

  return (
    <GenerationContext.Provider value={{ generation, setGeneration }}>
      {children}
    </GenerationContext.Provider>
  );
};
