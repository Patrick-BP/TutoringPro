import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  change?: {
    value: string;
    isPositive: boolean;
    text: string;
  };
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBgColor,
  change,
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className={cn("rounded-full p-2", iconBgColor)}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>

        {change && (
          <div className="mt-4 flex items-center">
            <span
              className={cn(
                "text-sm font-medium",
                change.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {change.value}
            </span>
            <span className="text-sm text-gray-500 ml-2">{change.text}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
