
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANOMALY_SEVERITY } from '@/config/api';

interface StatusBannerProps {
  status: 'normal' | 'anomaly';
  severity?: keyof typeof ANOMALY_SEVERITY;
  lastAnomalyTime?: string;
}

const StatusBanner = ({ status, severity = 'LOW', lastAnomalyTime }: StatusBannerProps) => {
  const isAnomalyActive = status === 'anomaly';
  const severityInfo = ANOMALY_SEVERITY[severity];

  const getSeverityStyles = () => {
    if (!isAnomalyActive) return {
      bg: "bg-green-950/50 border-green-500",
      badge: "bg-green-500 text-white",
      text: "text-green-200",
      dot: "bg-green-500 animate-pulse"
    };

    switch (severity) {
      case 'LOW':
        return {
          bg: "bg-yellow-950/50 border-yellow-500",
          badge: "bg-yellow-500 text-black animate-pulse-anomaly",
          text: "text-yellow-200",
          dot: "bg-yellow-500 animate-ping"
        };
      case 'MEDIUM':
        return {
          bg: "bg-orange-950/50 border-orange-500",
          badge: "bg-orange-500 text-white animate-pulse-anomaly",
          text: "text-orange-200",
          dot: "bg-orange-500 animate-ping"
        };
      case 'HIGH':
        return {
          bg: "bg-red-950/50 border-red-500 anomaly-glow",
          badge: "bg-red-500 text-white animate-pulse-anomaly",
          text: "text-red-200",
          dot: "bg-red-500 animate-ping"
        };
      case 'CRITICAL':
        return {
          bg: "bg-purple-950/50 border-purple-500 anomaly-glow",
          badge: "bg-purple-500 text-white animate-pulse-anomaly",
          text: "text-purple-200",
          dot: "bg-purple-500 animate-ping"
        };
      default:
        return {
          bg: "bg-red-950/50 border-red-500 anomaly-glow",
          badge: "bg-red-500 text-white animate-pulse-anomaly",
          text: "text-red-200",
          dot: "bg-red-500 animate-ping"
        };
    }
  };

  const styles = getSeverityStyles();

  return (
    <Alert className={cn("transition-all duration-500 border-2", styles.bg)}>
      <Bell className={cn(
        "h-5 w-5",
        isAnomalyActive ? `text-${severityInfo.color}-400 animate-pulse` : "text-green-400"
      )} />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Badge 
            variant={isAnomalyActive ? "destructive" : "secondary"}
            className={cn("text-sm font-semibold", styles.badge)}
          >
            {isAnomalyActive 
              ? `🚨 ${severityInfo.label.toUpperCase()} ANOMALY` 
              : '✅ SYSTEM NORMAL'
            }
          </Badge>
          {isAnomalyActive && lastAnomalyTime && (
            <span className={cn("text-sm", styles.text)}>
              Last detected at {lastAnomalyTime}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-full", styles.dot)}></div>
          <span className={cn("text-sm font-medium", styles.text)}>
            {isAnomalyActive ? 'Alert Active' : 'Monitoring Active'}
          </span>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default StatusBanner;
