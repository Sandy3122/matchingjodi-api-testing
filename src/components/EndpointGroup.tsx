import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ApiEndpoint, Environment } from '../types/api';
import EndpointCard from './EndpointCard';

interface EndpointGroupProps {
  groupName: string;
  endpoints: ApiEndpoint[];
  environment: Environment;
  onResponseReceived?: (endpoint: ApiEndpoint, response: any) => void;
}

const EndpointGroup: React.FC<EndpointGroupProps> = ({ 
  groupName, 
  endpoints,
  environment,
  onResponseReceived
}) => {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div className="mb-6">
      <div 
        className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700 cursor-pointer" 
        onClick={() => setCollapsed(!collapsed)}
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
          {groupName}
          <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
            ({endpoints.length})
          </span>
        </h2>
        <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          {collapsed ? (
            <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronUp size={20} className="text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>
      
      {!collapsed && (
        <div className="space-y-4">
          {endpoints.map((endpoint) => (
            <EndpointCard 
              key={endpoint.id} 
              endpoint={endpoint} 
              environment={environment}
              onResponseReceived={onResponseReceived}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EndpointGroup;