
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell } from 'lucide-react';

interface Anomaly {
  id: string;
  timestamp: number;
  reason: string;
  temperature: number;
  vibration: number;
}

interface AnomalyLogProps {
  anomalies: Anomaly[];
}

const AnomalyLog = ({ anomalies }: AnomalyLogProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-red-400" />
          Anomaly Log
          <Badge variant="secondary" className="ml-auto">
            {anomalies.length} total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          {anomalies.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-slate-400">
              <div className="text-center">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No anomalies detected yet</p>
                <p className="text-sm">System is running normally</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {anomalies.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-white font-medium">
                        {anomaly.reason}
                      </span>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      ANOMALY
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-slate-300 mb-3">
                    <time>
                      {new Date(anomaly.timestamp).toLocaleString()}
                    </time>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-blue-500/10 rounded p-2">
                      <span className="text-blue-300">Temperature:</span>
                      <div className="text-blue-200 font-mono">
                        {anomaly.temperature.toFixed(1)}°C
                      </div>
                    </div>
                    <div className="bg-cyan-500/10 rounded p-2">
                      <span className="text-cyan-300">Vibration:</span>
                      <div className="text-cyan-200 font-mono">
                        {anomaly.vibration.toFixed(2)} Hz
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AnomalyLog;
