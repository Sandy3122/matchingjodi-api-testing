export interface Environment {
  name: string;
  baseUrl: string;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  successExample?: string;
  errorExample?: string;
  group: string;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  data: any;
  error?: string;
  duration: number;
  timestamp: Date;
}

export interface ApiRequestHistory {
  endpoint: ApiEndpoint;
  environment: Environment;
  response: ApiResponse;
  timestamp: Date;
}