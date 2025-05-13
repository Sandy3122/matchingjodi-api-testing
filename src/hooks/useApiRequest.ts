import { useState } from 'react';
import axios from 'axios';
import { ApiEndpoint, ApiResponse, Environment } from '../types/api';

export const useApiRequest = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const executeRequest = async (endpoint: ApiEndpoint, environment: Environment): Promise<ApiResponse> => {
    setLoading(true);
    const startTime = performance.now();
    
    try {
      const url = `${environment.baseUrl}${endpoint.path}`;
      const method = endpoint.method.toLowerCase();
      
      const response = await axios({
        method,
        url,
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept',
        },
        withCredentials: false
      });
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      const apiResponse: ApiResponse = {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        duration,
        timestamp: new Date(),
      };
      
      setResponse(apiResponse);
      setLoading(false);
      return apiResponse;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      let errorMessage = 'Unknown error occurred';
      let status = 500;
      let statusText = 'Internal Server Error';
      let data = null;
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.message;
        if (error.response) {
          status = error.response.status;
          statusText = error.response.statusText;
          data = error.response.data;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      const apiResponse: ApiResponse = {
        status,
        statusText,
        data,
        error: errorMessage,
        duration,
        timestamp: new Date(),
      };
      
      setResponse(apiResponse);
      setLoading(false);
      return apiResponse;
    }
  };

  return { loading, response, executeRequest };
};