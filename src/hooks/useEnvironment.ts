import { useState, useEffect } from 'react';
import { Environment } from '../types/api';

const environments: Environment[] = [
  { name: 'Production', baseUrl: 'https://www.matchingjodi.com' },
  { name: 'Stage', baseUrl: 'https://matchingjodi-backup.web.app' },
];

export const useEnvironment = () => {
  // Ensure the default environment is set to "Production"
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment>(environments[0]);
  
  // Load saved environment from localStorage if available
  useEffect(() => {
    const savedEnvironment = localStorage.getItem('selectedEnvironment');
    if (savedEnvironment) {
      try {
        const parsed = JSON.parse(savedEnvironment);
        const found = environments.find(env => env.name === parsed.name);
        if (found) {
          setSelectedEnvironment(found);
        }
      } catch (error) {
        console.error('Failed to parse saved environment:', error);
      }
    }
  }, []);
  
  // Save selected environment to localStorage
  const changeEnvironment = (environment: Environment) => {
    setSelectedEnvironment(environment);
    localStorage.setItem('selectedEnvironment', JSON.stringify(environment));
  };
  
  return { selectedEnvironment, changeEnvironment, environments };
};