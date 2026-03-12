import { createClient } from '@base44/sdk';
import { appParams } from '../lib/app-params'; // Usei ../ porque o @/ não funciona

export const base44 = createClient({
  apiKey: appParams.apiKey,
  environment: appParams.environment
});