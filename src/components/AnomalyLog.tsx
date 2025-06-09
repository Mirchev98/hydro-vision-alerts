
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell } from 'lucide-react';
import { ANOMALY_SEVERITY } from '@/config/api';
import { cn } from '@/lib/utils';

interface Anomaly {
  id: string;
  timestamp: number;
  reason: string;
  temperature: number;
  vibration: number;
  severity: keyof typeof ANOMALY_SEVERITY;
}

interface AnomalyLogProps {
  anomalies: Anomaly[];
}

const AnomalyLog = ({ anomalies }: AnomalyLogProps) => {
  const getSeverityStyles = (severity: keyof typeof ANOMALY_SEVERITY) => {
    const severityInfo = ANOMALY_SEVERITY[severity];
    switch (severityInfo.color) {
      case 'yellow':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-600',
          text: 'text-yellow-300',
          badge: 'bg-yellow-500'
        };
      case 'orange':
        return {
          bg: 'bg-orange-500/10',
          border: 'border-orange-600',
          text: 'text-orange-300',
          badge: 'bg-orange-500'
        };
      case 'red':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-600',
          text: 'text-red-300',
          badge: 'bg-red-500'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-600',
          text: 'text-purple-300',
          badge: 'bg-purple-500'
        };
      default:
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-600',
          text: 'text-red-300',
          badge: 'bg-red-500'
        };
    }
  };

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
              {anomalies.map((anomaly) => {
                const styles = getSeverityStyles(anomaly.severity);
                const severityInfo = ANOMALY_SEVERITY[anomaly.severity];
                
                return (
                  <div
                    key={anomaly.id}
                    className={cn(
                      "rounded-lg p-4 border hover:border-slate-500 transition-colors",
                      styles.bg,
                      styles.border
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full animate-pulse", styles.badge)}></div>
                        <span className="text-white font-medium">
                          {anomaly.reason}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Badge 
                          variant="destructive" 
                          className={cn("text-xs", styles.badge, "text-white")}
                        >
                          {severityInfo.label.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-slate-500 text-slate-300">
                          ANOMALY
                        </Badge>
                      </div>
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
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AnomalyLog;
