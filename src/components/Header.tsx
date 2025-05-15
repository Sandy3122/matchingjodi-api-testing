import React, { useEffect, useState } from 'react';
import EnvironmentSelector from './EnvironmentSelector';
import { Environment } from '../types/api';
import DarkModeToggle from 'react-dark-mode-toggle';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  currentEnvironment: Environment;
  onEnvironmentChange: (env: Environment) => void;
}

const Header: React.FC<HeaderProps> = ({ currentEnvironment, onEnvironmentChange }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <nav className="bg-white dark:bg-gray-800 fixed w-full z-50 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto px-4 py-3">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <img 
            src="https://i.postimg.cc/W1qxgjkZ/logo.jpg"
            width={35} height={35}
            // className="h-10 w-10 rounded-full" 
            alt="Logo" 
          />
          <div className="hidden lg:block md:block sm:block">
            <h1 className="text-xl md:text-sm font-semibold text-gray-900 dark:text-white truncate">
              MatchingJodi API Tester
            </h1>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex items-center space-x-4">
          <DarkModeToggle
            onChange={setIsDarkMode}
            checked={isDarkMode}
            size={50}
          />
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } w-full lg:hidden mt-4 border-t border-gray-200 dark:border-gray-600`}
      >
        <div className="flex flex-col space-y-4 py-4">
          {/* Centered Title for Mobile */}
          <div className="lg:hidden text-center px-4">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              MatchingJodi API Tester
            </h1>
          </div>

          {/* Base URL and Environment Selector */}
          <div className="flex flex-col items-center text-sm text-gray-600 dark:text-gray-300 px-4 space-y-2">
            <div className="flex flex-col items-center gap-1">
              <span className="font-medium">Base URL:</span>
              <span className="break-all text-center">{currentEnvironment.baseUrl}</span>
            </div>
            <EnvironmentSelector onEnvironmentChange={onEnvironmentChange} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;