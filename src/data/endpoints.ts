import { ApiEndpoint } from '../types/api';

export const endpoints: ApiEndpoint[] = [
      {
    id: 'collection-status',
    name: 'Collection Status',
    method: 'GET',
    path: '/api/cache/status',
    description: 'Displays status and document count of all collections in the cache.',
    group: 'Collection Status',
    successExample: `{
    "results": {
      "appusers": {
        "count": 51,
        "status": "success"
      },
      "dropdown": {
        "count": 31,
        "status": "success"
      },
      "countryDropdown": {
        "count": 81,
        "status": "success"
      },
      "accessRoles": {
        "count": 7,
        "status": "success"
      },
      "employeeRegistrationData": {
        "count": 3,
        "status": "success"
      },
      "routes": {
        "count": 5,
        "status": "success"
      }
    },
    "timestamp": "2025-05-13T20:40:00.000Z"
  }`,
    errorExample: `{
    "error": "Failed to fetch collection statuses",
    "environment": "stage"
  }`
  },
  {
    id: 'health-check',
    name: 'Health Check',
    method: 'GET',
    path: '/health',
    description: 'Returns overall service and Firebase/Redis health status.',
    group: 'Health',
    successExample: `{
  "status": "healthy",
  "timestamp": "2025-05-13T18:34:38.599Z",
  "environment": "stage",
  "services": {
    "firebase": {
      "status": "healthy",
      "message": "Firebase connection successful"
    },
    "redis": {
      "status": "healthy",
      "message": "Redis connection successful"
    },
    "storage": {
      "status": "healthy",
      "message": "Firebase Storage connection successful"
    },
    "auth": {
      "status": "healthy",
      "message": "Firebase Auth connection successful"
    },
    "rtdb": {
      "status": "healthy",
      "message": "Firebase RTDB connection successful"
    }
  },
  "version": "unknown"
}`,
    errorExample: `{
  "status": "unhealthy",
  "error": "Internal Server Error",
  "timestamp": "2025-05-13T18:34:38.599Z"
}`
  },
  {
    id: 'cache-health',
    name: 'Cache Health',
    method: 'GET',
    path: '/api/cache/health',
    description: 'Returns Redis scheduler and cache status.',
    group: 'Cache Management',
    successExample: `{
  "status": "healthy",
  "timestamp": "2024-03-21T10:30:00.000Z",
  "environment": "stage",
  "cache": {
    "enabled": true,
    "scheduler": {
      "isRunning": true,
      "lastRun": "2024-03-21T10:00:00.000Z",
      "nextScheduledRun": "2024-03-21T11:00:00.000Z"
    }
  }
}`,
    errorExample: `{
  "status": "unhealthy",
  "error": "Redis connection failed"
}`
  },
  {
    id: 'cache-status',
    name: 'Cache Status',
    method: 'GET',
    path: '/api/cache/status',
    description: 'Shows if the cache scheduler is running.',
    group: 'Cache Management',
    successExample: `{
  "isRunning": true,
  "lastRun": "2025-05-13T18:30:03.681Z",
  "nextScheduledRun": "2025-05-13T20:30:00.000Z"
}`,
    errorExample: `{
  "error": "Scheduler fetch failed",
  "environment": "stage"
}`
  },
  {
    id: 'warm-cache',
    name: 'Warm Cache',
    method: 'POST',
    path: '/api/cache/warm',
    description: 'Manually warms up the cache.',
    group: 'Cache Management',
    successExample: `{
  "isRunning": true,
  "lastRun": "2025-05-13T18:30:03.681Z",
  "nextScheduledRun": "2025-05-13T20:30:00.000Z",
  "results": {
    "success": true,
    "collections": {
      "appusers": {
        "count": 51,
        "status": "success"
      },
      "dropdown": {
        "count": 31,
        "status": "success"
      },
      "countryDropdown": {
        "count": 81,
        "status": "success"
      },
      "accessRoles": {
        "count": 7,
        "status": "success"
      },
      "employeeRegistrationData": {
        "count": 3,
        "status": "success"
      },
      "routes": {
        "count": 5,
        "status": "success"
      }
    }
  }
}`,
    errorExample: `{
  "error": "Cache warm failed",
  "environment": "stage",
  "force": true
}`
  },
  {
    id: 'redis-keys',
    name: 'Redis Keys',
    method: 'GET',
    path: '/api/cache/redis/keys',
    description: 'Lists all Redis keys for the environment.',
    group: 'Redis Management',
    successExample: `{
  "keys": [
    "stage:routes",
    "stage:dropdown",
    "stage:employeeRegistrationData",
    "stage:dropdown:country",
    "stage:appusers",
    "stage:dropdown:accessRoles"
  ],
  "environment": "stage"
}`,
    errorExample: `{
  "error": "Redis key fetch failed",
  "environment": "stage",
  "force": false
}`
  },
  {
    id: 'flush-redis',
    name: 'Flush Redis',
    method: 'POST',
    path: '/api/cache/redis/flush',
    description: 'Clears all Redis keys for the environment.',
    group: 'Redis Management',
    successExample: `{
  "success": true,
  "environment": "stage"
}`,
    errorExample: `{
  "error": "Flush failed",
  "environment": "stage",
  "force": true
}`
  },
  {
    id: 'start-scheduler',
    name: 'Start Scheduler',
    method: 'POST',
    path: '/api/cache/start',
    description: 'Starts the Redis cache scheduler.',
    group: 'Scheduler Management',
    successExample: `{
  "isRunning": true,
  "environment": "stage"
}`,
    errorExample: `{
  "error": "Scheduler start failed",
  "environment": "stage",
  "force": true
}`
  },
  {
    id: 'stop-scheduler',
    name: 'Stop Scheduler',
    method: 'POST',
    path: '/api/cache/stop',
    description: 'Stops the Redis cache scheduler.',
    group: 'Scheduler Management',
    successExample: `{
  "isRunning": false,
  "environment": "stage"
}`,
    errorExample: `{
  "error": "Scheduler stop failed",
  "environment": "stage",
  "force": true
}`
  }
];

export const endpointGroups = [...new Set(endpoints.map(endpoint => endpoint.group))];