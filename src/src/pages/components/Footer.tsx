import React from "react";
import { Link } from "react-router";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white shadow-inner">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm md:text-base font-medium">© {new Date().getFullYear()} Rush Hour Game Solver</p>
            <p className="text-xs text-gray-400 mt-1">Created for Strategi dan Algoritma Tucil 3 ITB</p>
            <div className="flex space-x-2 mt-2">
              <span className="text-xs text-gray-300">13523008</span>
              <span className="text-xs text-gray-300">13523036</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base">
              About Us
            </Link>
            <a
              href="https://github.com/yonatan-nyo/Tucil3_13523008_13523036"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
