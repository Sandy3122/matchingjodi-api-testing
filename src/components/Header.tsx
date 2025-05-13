import React from 'react';
import { Globe } from 'lucide-react';
import EnvironmentSelector from './EnvironmentSelector';
import { Environment } from '../types/api';

interface HeaderProps {
  currentEnvironment: Environment;
  onEnvironmentChange: (env: Environment) => void;
}

const Header: React.FC<HeaderProps> = ({ currentEnvironment, onEnvironmentChange }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {/* <Globe size={28} className="text-purple-600 dark:text-purple-400" /> */}
              <img src="https://i.postimg.cc/W1qxgjkZ/logo.jpg" width={30} height={30} alt="" srcset="" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">MatchingJodi API Tester</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Test API endpoints across environments</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Base URL:</span> {currentEnvironment.baseUrl}
            </div>
            <EnvironmentSelector onEnvironmentChange={onEnvironmentChange} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;