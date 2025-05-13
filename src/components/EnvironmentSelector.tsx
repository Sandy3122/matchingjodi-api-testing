import React from 'react';
import { Settings, ChevronDown } from 'lucide-react';
import { Environment } from '../types/api';
import { useEnvironment } from '../hooks/useEnvironment';

interface EnvironmentSelectorProps {
  onEnvironmentChange?: (environment: Environment) => void;
}

const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({ onEnvironmentChange }) => {
  const { selectedEnvironment, changeEnvironment, environments } = useEnvironment();
  
  const handleEnvironmentChange = (environment: Environment) => {
    changeEnvironment(environment);
    if (onEnvironmentChange) {
      onEnvironmentChange(environment);
    }
  };
  
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-2 bg-white dark:bg-gray-800 py-2 px-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200"
      >
        <Settings size={16} className="text-purple-600 dark:text-purple-400" />
        <span className="font-medium">{selectedEnvironment.name}</span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
          <div className="py-1">
            {environments.map((env) => (
              <button
                key={env.name}
                onClick={() => {
                  handleEnvironmentChange(env);
                  setDropdownOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  selectedEnvironment.name === env.name
                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {env.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentSelector;