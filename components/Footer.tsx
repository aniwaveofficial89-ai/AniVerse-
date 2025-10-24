
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950/50 border-t border-slate-800 mt-12">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} AniVerse. All Rights Reserved.</p>
        <p className="mt-1">A demonstration project built with React and Tailwind CSS.</p>
      </div>
    </footer>
  );
};

export default Footer;
