"use client";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: "blue" | "green" | "purple" | "yellow" | "orange" | "red";
}

const colorClasses = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  yellow: "bg-yellow-100 text-yellow-600",
  orange: "bg-orange-100 text-orange-600",
  red: "bg-red-100 text-red-600",
};

export default function SummaryCard({
  title,
  value,
  icon,
  color,
}: SummaryCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}
