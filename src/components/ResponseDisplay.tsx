import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ApiResponse } from '../types/api';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface ResponseDisplayProps {
  response?: ApiResponse;
  data?: any;
  isExample?: boolean;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response, data, isExample = false }) => {
  const displayData = response?.data || data;
  const jsonStr = JSON.stringify(displayData, null, 2);
  
  if (!response && !data) return null;
  
  return (
    <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
      {!isExample && response && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2">
            {response.status >= 200 && response.status < 300 ? (
              <CheckCircle size={16} className="text-green-500" />
            ) : (
              <AlertCircle size={16} className="text-red-500" />
            )}
            <span className={`font-medium ${
              response.status >= 200 && response.status < 300 
                ? 'text-green-700 dark:text-green-400' 
                : 'text-red-700 dark:text-red-400'
            }`}>
              {response.status} {response.statusText}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock size={14} className="mr-1" />
            <span>{response.duration.toFixed(0)} ms</span>
          </div>
        </div>
      )}
      <div className="max-h-96 overflow-auto" style={{ backgroundColor: '#282c34' }}>
        <SyntaxHighlighter 
          language="json" 
          style={atomDark}
          customStyle={{ margin: 0, borderRadius: 0 }}
        >
          {jsonStr}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default ResponseDisplay;