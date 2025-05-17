import React from 'react';
import { Link } from 'react-router';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-700 p-4">
      <div className="container mx-auto flex justify-between">
        <div className="text-white text-lg font-bold">
          <Link to="/">Rush Hour Solver</Link>
        </div>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-blue-200">Home</Link>
          <Link to="/about" className="text-white hover:text-blue-200">About</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;