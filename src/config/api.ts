
// API Configuration
export const API_CONFIG = {
  // For production, replace with your actual backend URL
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws',
  ENDPOINTS: {
    STREAM: '/api/stream',
    ANOMALIES: '/api/anomalies'
  },
  // Polling interval in milliseconds
  POLL_INTERVAL: 1000,
  // Maximum number of data points to keep in memory
  MAX_CHART_POINTS: 50,
  // Maximum number of anomalies to keep in log
  MAX_ANOMALY_LOG: 100,
  // Connection retry settings
  RETRY_INTERVAL: 3000,
  MAX_RETRY_ATTEMPTS: 10
};

// Anomaly severity levels
export const ANOMALY_SEVERITY = {
  LOW: { level: 1, color: 'yellow', label: 'Low' },
  MEDIUM: { level: 2, color: 'orange', label: 'Medium' },
  HIGH: { level: 3, color: 'red', label: 'High' },
  CRITICAL: { level: 4, color: 'purple', label: 'Critical' }
} as const;

// CORS configuration helper
export const getCorsHeaders = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
});
