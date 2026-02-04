"use client";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: string;
  color:
    | "blue"
    | "green"
    | "purple"
    | "yellow"
    | "orange"
    | "red"
    | "pink"
    | "indigo"
    | "teal"
    | "cyan";
}

const cardColors = {
  blue: "bg-blue-50 border border-blue-200",
  green: "bg-green-50 border border-green-200",
  purple: "bg-purple-50 border border-purple-200",
  yellow: "bg-yellow-50 border border-yellow-200",
  orange: "bg-orange-50 border border-orange-200",
  red: "bg-red-50 border border-red-200",
  pink: "bg-pink-50 border border-pink-200",
  indigo: "bg-indigo-50 border border-indigo-200",
  teal: "bg-teal-50 border border-teal-200",
  cyan: "bg-cyan-50 border border-cyan-200",
};

const iconColors = {
  blue: "bg-blue-500 text-white",
  green: "bg-green-500 text-white",
  purple: "bg-purple-500 text-white",
  yellow: "bg-yellow-500 text-white",
  orange: "bg-orange-500 text-white",
  red: "bg-red-500 text-white",
  pink: "bg-pink-500 text-white",
  indigo: "bg-indigo-500 text-white",
  teal: "bg-teal-500 text-white",
  cyan: "bg-cyan-500 text-white",
};

export default function SummaryCard({
  title,
  value,
  icon,
  color,
}: SummaryCardProps) {
  return (
    <div className={`rounded-xl shadow-sm p-6 ${cardColors[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${iconColors[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}
