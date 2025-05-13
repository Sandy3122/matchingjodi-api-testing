import React from 'react';
import { Clock, X } from 'lucide-react';
import { ApiRequestHistory } from '../types/api';
import ResponseDisplay from './ResponseDisplay';

interface RequestHistoryProps {
  history: ApiRequestHistory[];
  onClearHistory: () => void;
}

const RequestHistory: React.FC<RequestHistoryProps> = ({ history, onClearHistory }) => {
  const [expanded, setExpanded] = React.useState<string | null>(null);
  
  if (history.length === 0) {
    return null;
  }
  
  const toggleExpand = (id: string) => {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
    }
  };
  
  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <h3 className="font-medium text-gray-800 dark:text-white flex items-center">
          <Clock size={16} className="mr-2 text-purple-600 dark:text-purple-400" />
          Request History
        </h3>
        <button
          onClick={onClearHistory}
          className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 flex items-center"
        >
          <X size={14} className="mr-1" />
          Clear
        </button>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {history.map((item, index) => {
          const id = `history-${index}`;
          const isSuccess = item.response.status >= 200 && item.response.status < 300;
          
          return (
            <div key={id} className="px-4 py-3">
              <div 
                className="flex flex-wrap items-center justify-between gap-2 cursor-pointer" 
                onClick={() => toggleExpand(id)}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    item.endpoint.method === 'GET' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    {item.endpoint.method}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {item.endpoint.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.environment.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${
                    isSuccess 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {item.response.status} {item.response.statusText}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              
              {expanded === id && (
                <div className="mt-3">
                  <ResponseDisplay response={item.response} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RequestHistory;