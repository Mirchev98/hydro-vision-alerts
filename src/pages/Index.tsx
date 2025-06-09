import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell } from 'lucide-react';
import StatusBanner from '@/components/StatusBanner';
import AnomalyLog from '@/components/AnomalyLog';
import TimeRangeSelector from '@/components/TimeRangeSelector';
import ConnectionStatus from '@/components/ConnectionStatus';
import { useWebSocket } from '@/hooks/useWebSocket';
import { API_CONFIG, ANOMALY_SEVERITY } from '@/config/api';

// Mock data generator with severity levels
const generateMockData = () => {
  const now = Date.now();
  const isAnomaly = Math.random() < 0.1; // 10% chance of anomaly
  
  let severity: keyof typeof ANOMALY_SEVERITY = 'LOW';
  if (isAnomaly) {
    const rand = Math.random();
    if (rand < 0.1) severity = 'CRITICAL';
    else if (rand < 0.3) severity = 'HIGH';
    else if (rand < 0.6) severity = 'MEDIUM';
    else severity = 'LOW';
  }
  
  return {
    timestamp: now,
    temperature: 20 + Math.sin(now / 10000) * 5 + (Math.random() - 0.5) * (isAnomaly ? 15 : 2),
    vibration: 0.5 + Math.cos(now / 8000) * 0.3 + (Math.random() - 0.5) * (isAnomaly ? 2 : 0.1),
    is_anomaly: isAnomaly,
    severity: severity,
    anomaly_reason: isAnomaly ? ['Temperature spike', 'Vibration anomaly', 'Sensor malfunction'][Math.floor(Math.random() * 3)] : null
  };
};

// Fetcher function for SWR
const fetcher = async (url: string) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return generateMockData();
};

interface DataPoint {
  timestamp: number;
  temperature: number;
  vibration: number;
  is_anomaly: boolean;
  severity: keyof typeof ANOMALY_SEVERITY;
  anomaly_reason?: string | null;
  time: string;
}

interface Anomaly {
  id: string;
  timestamp: number;
  reason: string;
  temperature: number;
  vibration: number;
  severity: keyof typeof ANOMALY_SEVERITY;
}

const Index = () => {
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [currentStatus, setCurrentStatus] = useState<'normal' | 'anomaly'>('normal');
  const [currentSeverity, setCurrentSeverity] = useState<keyof typeof ANOMALY_SEVERITY>('LOW');
  const [lastAnomalyTime, setLastAnomalyTime] = useState<string>('');
  const [timeRange, setTimeRange] = useState(15); // minutes
  const [useWebSocketConnection, setUseWebSocketConnection] = useState(false);

  // WebSocket connection
  const { isConnected, isRetrying, lastError, retry } = useWebSocket({
    url: API_CONFIG.WS_URL,
    onMessage: handleWebSocketMessage,
    shouldReconnect: true
  });

  function handleWebSocketMessage(data: any) {
    if (useWebSocketConnection) {
      handleNewData(data);
    }
  }

  // SWR polling (fallback when WebSocket is not used)
  const { data, error } = useSWR(
    !useWebSocketConnection ? '/api/stream' : null, 
    fetcher, 
    { 
      refreshInterval: useWebSocketConnection ? 0 : API_CONFIG.POLL_INTERVAL,
      revalidateOnFocus: false 
    }
  );

  const handleNewData = useCallback((newData: any) => {
    const newPoint: DataPoint = {
      ...newData,
      time: new Date(newData.timestamp).toLocaleTimeString()
    };

    // Filter data based on time range
    const cutoffTime = Date.now() - (timeRange * 60 * 1000);
    
    setChartData(prev => {
      const updated = [...prev, newPoint];
      return updated.filter(point => point.timestamp > cutoffTime);
    });

    // Handle anomalies
    if (newData.is_anomaly) {
      setCurrentStatus('anomaly');
      setCurrentSeverity(newData.severity || 'LOW');
      const anomalyTime = new Date(newData.timestamp).toLocaleTimeString();
      setLastAnomalyTime(anomalyTime);
      
      const newAnomaly: Anomaly = {
        id: `${newData.timestamp}-${Math.random()}`,
        timestamp: newData.timestamp,
        reason: newData.anomaly_reason || 'Unknown anomaly',
        temperature: newData.temperature,
        vibration: newData.vibration,
        severity: newData.severity || 'LOW'
      };
      
      setAnomalies(prev => [newAnomaly, ...prev].slice(0, API_CONFIG.MAX_ANOMALY_LOG));
    } else {
      setCurrentStatus('normal');
    }
  }, [timeRange]);

  useEffect(() => {
    if (data && !useWebSocketConnection) {
      handleNewData(data);
    }
  }, [data, useWebSocketConnection, handleNewData]);

  // Handle time range changes
  const handleTimeRangeChange = (minutes: number) => {
    setTimeRange(minutes);
    const cutoffTime = Date.now() - (minutes * 60 * 1000);
    setChartData(prev => prev.filter(point => point.timestamp > cutoffTime));
  };

  const getSeverityColor = (severity: keyof typeof ANOMALY_SEVERITY) => {
    const severityInfo = ANOMALY_SEVERITY[severity];
    switch (severityInfo.color) {
      case 'yellow': return '#fbbf24';
      case 'orange': return '#f97316';
      case 'red': return '#ef4444';
      case 'purple': return '#a855f7';
      default: return '#ef4444';
    }
  };

  if (error && !useWebSocketConnection) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert className="max-w-md border-destructive">
          <Bell className="h-4 w-4" />
          <AlertDescription>
            Failed to connect to monitoring system. Please check your connection.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Hydro Vision Alerts
          </h1>
          <p className="text-blue-200">
            Real-time anomaly detection for hydro monitoring systems
          </p>
        </div>

        {/* Connection Status */}
        <ConnectionStatus 
          isConnected={useWebSocketConnection ? isConnected : !error}
          isRetrying={isRetrying}
          lastError={lastError}
          onRetry={retry}
        />

        {/* Status Banner */}
        <StatusBanner 
          status={currentStatus} 
          severity={currentSeverity}
          lastAnomalyTime={lastAnomalyTime}
        />

        {/* Time Range Selector */}
        <TimeRangeSelector 
          onRangeChange={handleTimeRangeChange}
          currentRange={timeRange}
        />

        {/* Main Chart */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              Live Sensor Data ({timeRange} min view)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="rgba(148, 163, 184, 0.8)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="rgba(148, 163, 184, 0.8)"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.95)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    dot={false}
                    name="Temperature (°C)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="vibration" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    dot={false}
                    name="Vibration (Hz)"
                  />
                  {/* Anomaly points with severity colors */}
                  {chartData.map((point, index) => 
                    point.is_anomaly ? (
                      <ReferenceDot
                        key={index}
                        x={point.time}
                        y={point.temperature}
                        r={4}
                        fill={getSeverityColor(point.severity)}
                        stroke="#fca5a5"
                        strokeWidth={2}
                      />
                    ) : null
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Current Temperature</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {chartData.length > 0 ? `${chartData[chartData.length - 1].temperature.toFixed(1)}°C` : '--'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Current Vibration</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {chartData.length > 0 ? `${chartData[chartData.length - 1].vibration.toFixed(2)} Hz` : '--'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Anomalies</p>
                  <p className="text-2xl font-bold text-red-400">
                    {anomalies.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Anomaly Log */}
        <AnomalyLog anomalies={anomalies} />
      </div>
    </div>
  );
};

export default Index;
