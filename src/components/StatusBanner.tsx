
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBannerProps {
  status: 'normal' | 'anomaly';
  lastAnomalyTime?: string;
}

const StatusBanner = ({ status, lastAnomalyTime }: StatusBannerProps) => {
  const isAnomalyActive = status === 'anomaly';

  return (
    <Alert 
      className={cn(
        "transition-all duration-500 border-2",
        isAnomalyActive 
          ? "bg-red-950/50 border-red-500 anomaly-glow" 
          : "bg-green-950/50 border-green-500"
      )}
    >
      <Bell className={cn(
        "h-5 w-5",
        isAnomalyActive ? "text-red-400 animate-pulse" : "text-green-400"
      )} />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Badge 
            variant={isAnomalyActive ? "destructive" : "secondary"}
            className={cn(
              "text-sm font-semibold",
              isAnomalyActive 
                ? "bg-red-500 text-white animate-pulse-anomaly" 
                : "bg-green-500 text-white"
            )}
          >
            {isAnomalyActive ? '🚨 ANOMALY DETECTED' : '✅ SYSTEM NORMAL'}
          </Badge>
          {isAnomalyActive && lastAnomalyTime && (
            <span className="text-red-200 text-sm">
              Last detected at {lastAnomalyTime}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-3 h-3 rounded-full",
            isAnomalyActive 
              ? "bg-red-500 animate-ping" 
              : "bg-green-500 animate-pulse"
          )}></div>
          <span className={cn(
            "text-sm font-medium",
            isAnomalyActive ? "text-red-200" : "text-green-200"
          )}>
            {isAnomalyActive ? 'Alert Active' : 'Monitoring Active'}
          </span>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default StatusBanner;
