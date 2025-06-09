// Update this page (the content is just a fallback if you fail to update the page)

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell } from 'lucide-react';
import StatusBanner from '@/components/StatusBanner';
import AnomalyLog from '@/components/AnomalyLog';

// Mock data generator for demonstration
const generateMockData = () => {
  const now = Date.now();
  const isAnomaly = Math.random() < 0.1; // 10% chance of anomaly
  
  return {
    timestamp: now,
    temperature: 20 + Math.sin(now / 10000) * 5 + (Math.random() - 0.5) * (isAnomaly ? 15 : 2),
    vibration: 0.5 + Math.cos(now / 8000) * 0.3 + (Math.random() - 0.5) * (isAnomaly ? 2 : 0.1),
    is_anomaly: isAnomaly,
    anomaly_reason: isAnomaly ? ['Temperature spike', 'Vibration anomaly', 'Sensor malfunction'][Math.floor(Math.random() * 3)] : null
  };
};

// Fetcher function for SWR
const fetcher = async (url: string) => {
  // For demo purposes, we'll use mock data
  // In production, replace with: return axios.get(url).then(res => res.data)
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
  return generateMockData();
};

interface DataPoint {
  timestamp: number;
  temperature: number;
  vibration: number;
  is_anomaly: boolean;
  anomaly_reason?: string | null;
  time: string;
}

interface Anomaly {
  id: string;
  timestamp: number;
  reason: string;
  temperature: number;
  vibration: number;
}

const Index = () => {
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [currentStatus, setCurrentStatus] = useState<'normal' | 'anomaly'>('normal');
  const [lastAnomalyTime, setLastAnomalyTime] = useState<string>('');

  // Poll data every second
  const { data, error } = useSWR('/api/stream', fetcher, { 
    refreshInterval: 1000,
    revalidateOnFocus: false 
  });

  useEffect(() => {
    if (data) {
      const newPoint: DataPoint = {
        ...data,
        time: new Date(data.timestamp).toLocaleTimeString()
      };

      // Update chart data (keep last 50 points)
      setChartData(prev => {
        const updated = [...prev, newPoint];
        return updated.slice(-50);
      });

      // Handle anomalies
      if (data.is_anomaly) {
        setCurrentStatus('anomaly');
        const anomalyTime = new Date(data.timestamp).toLocaleTimeString();
        setLastAnomalyTime(anomalyTime);
        
        const newAnomaly: Anomaly = {
          id: `${data.timestamp}-${Math.random()}`,
          timestamp: data.timestamp,
          reason: data.anomaly_reason || 'Unknown anomaly',
          temperature: data.temperature,
          vibration: data.vibration
        };
        
        setAnomalies(prev => [newAnomaly, ...prev].slice(0, 100)); // Keep last 100 anomalies
      } else {
        setCurrentStatus('normal');
      }
    }
  }, [data]);

  if (error) {
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

        {/* Status Banner */}
        <StatusBanner 
          status={currentStatus} 
          lastAnomalyTime={lastAnomalyTime}
        />

        {/* Main Chart */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              Live Sensor Data
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
                  {/* Anomaly points */}
                  {chartData.map((point, index) => 
                    point.is_anomaly ? (
                      <ReferenceDot
                        key={index}
                        x={point.time}
                        y={point.temperature}
                        r={4}
                        fill="#ef4444"
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
