import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: "primary" | "accent" | "success" | "warning";
}

const StatsCard = ({ title, value, icon, color }: StatsCardProps) => {
  const colorMap = {
    primary: {
      bg: "bg-primary/10",
      text: "text-primary",
    },
    accent: {
      bg: "bg-accent/10",
      text: "text-accent",
    },
    success: {
      bg: "bg-green-500/10",
      text: "text-green-500",
    },
    warning: {
      bg: "bg-amber-500/10",
      text: "text-amber-500",
    },
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 flex items-center space-x-4">
      <div className={`w-10 h-10 ${colorMap[color].bg} rounded-md flex items-center justify-center`}>
        <div className={colorMap[color].text}>{icon}</div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
};

export default StatsCard;
