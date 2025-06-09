// API Configuration
export const API_CONFIG = {
  // For production, replace with your actual backend URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  ENDPOINTS: {
    STREAM: '/api/stream',
    ANOMALIES: '/api/anomalies'
  },
  // Polling interval in milliseconds
  POLL_INTERVAL: 1000,
  // Maximum number of data points to keep in memory
  MAX_CHART_POINTS: 50,
  // Maximum number of anomalies to keep in log
  MAX_ANOMALY_LOG: 100
};

// CORS configuration helper
export const getCorsHeaders = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
});
