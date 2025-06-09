
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeRangeSelectorProps {
  onRangeChange: (minutes: number) => void;
  currentRange: number;
}

const timeRanges = [
  { label: '5 min', minutes: 5 },
  { label: '15 min', minutes: 15 },
  { label: '1 hour', minutes: 60 },
  { label: '6 hours', minutes: 360 },
  { label: '24 hours', minutes: 1440 }
];

const TimeRangeSelector = ({ onRangeChange, currentRange }: TimeRangeSelectorProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Time Range:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {timeRanges.map((range) => (
              <Button
                key={range.minutes}
                variant="outline"
                size="sm"
                onClick={() => onRangeChange(range.minutes)}
                className={cn(
                  "text-xs transition-all",
                  currentRange === range.minutes
                    ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                    : "bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600"
                )}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeRangeSelector;
