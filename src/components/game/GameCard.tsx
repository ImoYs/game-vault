// src/components/game/GameCard.js
import Image from 'next/image';
import Link from 'next/link';

const GameCard = ({ game }) => {
  return (
    <div className="border rounded-lg p-4">
      <Link href={`/game/${game.id}`}>
        <Image src={game.background_image} alt={game.name} width={300} height={150} />
        <h3 className="text-lg font-bold">{game.name}</h3>
        <p>{game.genres?.map((genre) => genre.name).join(', ')}</p>
      </Link>
    </div>
  );
};

export default GameCard;