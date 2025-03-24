import { ReactNode } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  footerLabel?: string;
  footerUrl?: string;
  className?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
  footerLabel,
  footerUrl,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className={cn("flex-shrink-0 rounded-md p-3", iconBgColor)}>
            <div className={cn("text-xl", iconColor)}>{icon}</div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <div className="text-sm font-medium text-gray-500 truncate">{title}</div>
            <div className="text-lg font-medium text-gray-900">{value}</div>
          </div>
        </div>
      </CardContent>
      {footerLabel && (
        <CardFooter className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            {footerUrl ? (
              <a
                href={footerUrl}
                className="font-medium text-primary hover:text-primary-foreground"
              >
                {footerLabel}
              </a>
            ) : (
              <span className="font-medium text-gray-500">{footerLabel}</span>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
