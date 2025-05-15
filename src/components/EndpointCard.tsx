import React, { useState } from 'react';
import { Play, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Endpoint, ApiResponse, Environment } from '../types/api';
import { useApiRequest } from '../hooks/useApiRequest';
import ResponseDisplay from './ResponseDisplay';

interface EndpointCardProps {
  endpoint: Endpoint;
  environment: Environment;
  onResponseReceived?: (endpoint: Endpoint, response: ApiResponse) => void;
}

const EndpointCard: React.FC<EndpointCardProps> = ({ 
  endpoint, 
  environment,
  onResponseReceived 
}) => {
  const { loading, response, executeRequest } = useApiRequest();
  const [expanded, setExpanded] = useState(false);
  const [showExample, setShowExample] = useState(false);
  
  const handleExecute = async () => {
    const result = await executeRequest(endpoint, environment);
    if (onResponseReceived) {
      onResponseReceived(endpoint, result);
    }
  };

  const renderCollectionStatus = (data: any) => {
  console.log('Collection Status:', data?.results?.collections);
  console.log('Collection Status:', data);

  if (!data?.results?.collections) return <p>No collection data available.</p>;

  return (
    <table className="w-full text-left border-collapse border border-gray-200 dark:border-gray-700 mt-4">
      <thead>
        <tr>
          <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">Collection</th>
          <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">Count</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data.results.collections).map(([collection, details]: any) => (
          <tr key={collection}>
            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 capitalize">{collection}</td>
            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{details.count ?? 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};




  const getBadgeColor = () => {
    switch (endpoint.method) {
      case 'GET':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'POST':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'DELETE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getBadgeColor()}`}>
                {endpoint.method}
              </span>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{endpoint.name}</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{endpoint.path}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExample(!showExample)}
              className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              title="View example response"
            >
              <Info size={18} />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              title={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <button
              onClick={handleExecute}
              disabled={loading}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:ring-offset-gray-800 transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Play size={14} />
              )}
              {loading ? 'Executing...' : 'Execute'}
            </button>
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{endpoint.description}</div>
        
        {showExample && endpoint.successExample && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md border border-gray-200 dark:border-gray-600">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Example Response</h4>
            <ResponseDisplay data={JSON.parse(endpoint.successExample)} isExample />
          </div>
        )}
        
        {expanded && response && (
          <div className="mt-4">
            {endpoint.id === 'collection-status' ? (
              renderCollectionStatus(response.data)
            ) : (
              <ResponseDisplay response={response} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EndpointCard;