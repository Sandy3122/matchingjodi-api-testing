import React, { useState, useEffect } from 'react';
import { endpoints, endpointGroups } from './data/endpoints';
import { Environment, ApiEndpoint, ApiResponse, ApiRequestHistory } from './types/api';
import { environments } from './data/environments';
import EndpointGroup from './components/EndpointGroup';
import Header from './components/Header';
import RequestHistory from './components/RequestHistory';

function App() {
  const [environment, setEnvironment] = useState<Environment>(environments[0]);
  const [requestHistory, setRequestHistory] = useState<ApiRequestHistory[]>(() => {
    const savedHistory = localStorage.getItem('requestHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [report, setReport] = useState<any>(() => {
    const savedReport = localStorage.getItem('healthReport');
    return savedReport ? JSON.parse(savedReport) : null;
  });

  useEffect(() => {
    localStorage.setItem('requestHistory', JSON.stringify(requestHistory));
  }, [requestHistory]);

  useEffect(() => {
    if (report) {
      localStorage.setItem('healthReport', JSON.stringify(report));
    }
  }, [report]);

  const handleEnvironmentChange = (env: Environment) => {
    setEnvironment(env);
  };

  const handleResponseReceived = (endpoint: ApiEndpoint, response: ApiResponse) => {
    const historyItem: ApiRequestHistory = {
      endpoint,
      environment,
      response,
      timestamp: new Date(),
    };

    setRequestHistory((prev) => [historyItem, ...prev].slice(0, 10));
  };

  const clearHistory = () => {
    setRequestHistory([]);
    localStorage.removeItem('requestHistory');
  };

  const generateReport = async () => {
    const reportData: any[] = [];
    let cacheStatus = null;
    let redisKeys = null;

    for (const endpoint of endpoints) {
      if (endpoint.path.includes('/health')) {
        try {
          const response = await fetch(`${environment.baseUrl}${endpoint.path}`);
          const data = await response.json();
          reportData.push({
            endpoint: endpoint.path,
            status: response.status,
            data,
          });
        } catch (error) {
          reportData.push({
            endpoint: endpoint.path,
            status: 'Error',
            error: error.message,
          });
        }
      }
    }

    // Fetch Cache Status
    try {
      const cacheStatusResponse = await fetch(`${environment.baseUrl}/api/cache/status`);
      const cacheStatusData = await cacheStatusResponse.json();

      cacheStatus = {
        cache: cacheStatusData.status === 'healthy' ? 'Healthy' : 'Unhealthy',
        scheduler: {
          isRunning: cacheStatusData.isRunning,
          lastRun: cacheStatusData.lastRun,
          nextScheduledRun: cacheStatusData.nextScheduledRun,
        },
        results: cacheStatusData.results,
        verificationResults: cacheStatusData.verificationResults,
        logs: cacheStatusData.logs,
        errors: cacheStatusData.errors,
      };
    } catch (error) {
      console.error('Error fetching cache status:', error.message);
      cacheStatus = { cache: 'Error fetching cache status', scheduler: null };
    }

    // Fetch Redis Keys
    try {
      const redisKeysResponse = await fetch(`${environment.baseUrl}/api/cache/redis/keys`);
      const redisKeysData = await redisKeysResponse.json();
      redisKeys = redisKeysData.keys || [];
    } catch (error) {
      console.error('Error fetching Redis keys:', error.message);
      redisKeys = ['Error fetching Redis keys'];
    }

    const finalReport = {
      timestamp: new Date(),
      environment: environment.name,
      healthApis: reportData,
      cacheStatus,
      redisKeys,
    };

    setReport(finalReport);
  };

  const clearReport = () => {
    setReport(null);
    localStorage.removeItem('healthReport');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header currentEnvironment={environment} onEnvironmentChange={handleEnvironmentChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-y-8">
          {endpointGroups.map((group) => (
            <EndpointGroup
              key={group}
              groupName={group}
              endpoints={endpoints.filter((endpoint) => endpoint.group === group)}
              environment={environment}
              onResponseReceived={handleResponseReceived}
            />
          ))}

          <RequestHistory history={requestHistory} onClearHistory={clearHistory} />

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Health Report</h2>
            <button
              onClick={generateReport}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Generate Report
            </button>
            <button
              onClick={clearReport}
              className="mt-2 ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Report
            </button>
            {report && (
              <div className="mt-4">
                <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm text-gray-800 dark:text-gray-200">
                  {JSON.stringify(report, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            MatchingJodi API Tester &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;