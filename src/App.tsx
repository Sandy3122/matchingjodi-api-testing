import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { endpoints, endpointGroups } from './data/endpoints';
import { Environment, ApiEndpoint, ApiResponse, ApiRequestHistory } from './types/api';
import EndpointGroup from './components/EndpointGroup';
import Header from './components/Header';
import RequestHistory from './components/RequestHistory';
import { useEnvironment } from './hooks/useEnvironment';
import LoadingButton from './components/LoadingButton';

const queryClient = new QueryClient();

function App() {
  const { selectedEnvironment, changeEnvironment } = useEnvironment();
  const [requestHistory, setRequestHistory] = useState<ApiRequestHistory[]>(() => {
    const savedHistory = localStorage.getItem('requestHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [report, setReport] = useState<any>(() => {
    const savedReport = localStorage.getItem('healthReport');
    return savedReport ? JSON.parse(savedReport) : null;
  });
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    localStorage.setItem('requestHistory', JSON.stringify(requestHistory));
  }, [requestHistory]);

  useEffect(() => {
    if (report) {
      localStorage.setItem('healthReport', JSON.stringify(report));
    }
  }, [report]);

  const handleResponseReceived = (endpoint: ApiEndpoint, response: ApiResponse) => {
    const historyItem: ApiRequestHistory = {
      endpoint,
      environment: selectedEnvironment,
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
    setGeneratingReport(true);
    const reportData: any[] = [];
    let cacheStatus = null;
    let redisKeys = null;

    for (const endpoint of endpoints) {
      if (endpoint.path.includes('/health')) {
        try {
          const response = await fetch(`${selectedEnvironment.baseUrl}${endpoint.path}`);
          const data = await response.json();
          reportData.push({
            endpoint: endpoint.path,
            status: response.status,
            data,
          });
        } catch (error: any) {
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
      const cacheStatusResponse = await fetch(`${selectedEnvironment.baseUrl}/api/cache/status`);
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
    } catch (error: any) {
      console.error('Error fetching cache status:', error.message);
      cacheStatus = { cache: 'Error fetching cache status', scheduler: null };
    }

    // Fetch Redis Keys
    try {
      const redisKeysResponse = await fetch(`${selectedEnvironment.baseUrl}/api/cache/redis/keys`);
      const redisKeysData = await redisKeysResponse.json();
      redisKeys = redisKeysData.keys || [];
    } catch (error: any) {
      console.error('Error fetching Redis keys:', error.message);
      redisKeys = ['Error fetching Redis keys'];
    }

    const finalReport = {
      timestamp: new Date(),
      environment: selectedEnvironment.name,
      healthApis: reportData,
      cacheStatus,
      redisKeys,
    };

    setReport(finalReport);
    setGeneratingReport(false);
  };

  const clearReport = () => {
    setReport(null);
    localStorage.removeItem('healthReport');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header
          currentEnvironment={selectedEnvironment}
          onEnvironmentChange={changeEnvironment}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
          <div className="grid grid-cols-1 gap-y-8">
            {endpointGroups.map((group) => (
              <EndpointGroup
                key={group}
                groupName={group}
                endpoints={endpoints.filter((endpoint) => endpoint.group === group)}
                environment={selectedEnvironment}
                onResponseReceived={handleResponseReceived}
              />
            ))}

            <RequestHistory history={requestHistory} onClearHistory={clearHistory} />

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Health Report</h2>
              <div className="flex mt-2 gap-4">
                <LoadingButton
                  onClick={generateReport}
                  isLoading={generatingReport}
                  loadingText="Generating Report..."
                  className="px-2 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Generate Report
                </LoadingButton>
                <LoadingButton
                  onClick={clearReport}
                  isLoading={false}
                  showIcon={false}
                  className="px-2 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Clear Report
                </LoadingButton>
              </div>
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
              MatchingJodi API Tester
            </p>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;