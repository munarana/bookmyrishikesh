"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  AlertCircle,
  Star,
  XCircle,
  Users,
} from "lucide-react";

interface Activity {
  type: "booking" | "school" | "review" | "registration" | "cancelled";
  message: string;
  timestamp: Date;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityColor = (type: string) => {
    switch (type) {
      case "booking":
        return "text-green-600 bg-green-50";
      case "school":
        return "text-blue-600 bg-blue-50";
      case "review":
        return "text-purple-600 bg-purple-50";
      case "registration":
        return "text-amber-600 bg-amber-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <CheckCircle className="w-4 h-4" />;
      case "school":
        return <Users className="w-4 h-4" />;
      case "review":
        return <Star className="w-4 h-4" />;
      case "registration":
        return <AlertCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="border-none shadow-sm rounded-xl bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">
              No recent activity
            </p>
          ) : (
            activities.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {activity.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {getRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
