
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  isConnected: boolean;
  isRetrying: boolean;
  lastError?: string;
  onRetry: () => void;
}

const ConnectionStatus = ({ isConnected, isRetrying, lastError, onRetry }: ConnectionStatusProps) => {
  if (isConnected) {
    return (
      <Alert className="bg-green-950/50 border-green-500">
        <Wifi className="h-4 w-4 text-green-400" />
        <AlertDescription className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-500 text-white">
              ✅ CONNECTED
            </Badge>
            <span className="text-green-200 text-sm">Backend service online</span>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-red-950/50 border-red-500">
      <WifiOff className="h-4 w-4 text-red-400" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Badge variant="destructive" className="bg-red-500 text-white">
            ❌ DISCONNECTED
          </Badge>
          <span className="text-red-200 text-sm">
            {lastError || 'Backend service unavailable'}
          </span>
        </div>
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className={cn(
            "flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors",
            isRetrying
              ? "bg-slate-600 text-slate-400 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          )}
        >
          <RefreshCw className={cn("w-3 h-3", isRetrying && "animate-spin")} />
          {isRetrying ? 'Retrying...' : 'Retry'}
        </button>
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionStatus;
