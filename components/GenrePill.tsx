
import React from 'react';

interface GenrePillProps {
  genre: string;
}

const GenrePill: React.FC<GenrePillProps> = ({ genre }) => {
  return (
    <span className="text-xs font-semibold bg-slate-700/80 text-gray-200 px-2 py-1 rounded-full">
      {genre}
    </span>
  );
};

export default GenrePill;
