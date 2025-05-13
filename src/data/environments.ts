import { Environment } from '../types/api';

export const environments: Environment[] = [
  {
    name: 'Stage',
    baseUrl: 'https://matchingjodi-backup.web.app',
  },
  {
    name: 'Production',
    baseUrl: 'https://www.matchingjodi.com',
  }
];