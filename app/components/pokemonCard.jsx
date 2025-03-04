import Image from 'next/image';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { typeColors } from '../utils/typeColors';



const PokemonCard = ({ pokemon }) => {
  return (
    <Link href={`/pokemon?id=${pokemon.id}`} className="block">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 cursor-pointer">
        {/* Pokemon Image */}
        <div className="bg-gray-100 pt-4 px-4">
          <div className="relative h-48 w-full">
            <Image
              src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              width={200}
              height={200}
              className="mx-auto object-contain transition-opacity opacity-100"
            />
          </div>
        </div>
        
        {/* Pokemon Info */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold capitalize text-slate-700">{pokemon.name}</h3>
            <span className="text-gray-500 font-medium">#{pokemon.id.toString().padStart(3, '0')}</span>
          </div>
          
          {/* Pokemon Types */}
          <div className="flex gap-2">
            {pokemon.types.map((type) => (
              <span
                key={type.type.name}
                className={`${typeColors[type.type.name] || 'bg-gray-400'} text-white px-3 py-1 rounded-full text-xs font-medium capitalize`}
              >
                {type.type.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PokemonCard;