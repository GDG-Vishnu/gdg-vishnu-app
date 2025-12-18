import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Activity, Pencil, PencilIcon } from "lucide-react";
import {
  CurvedDoodle,
  TriangleDoodle,
  BlobDoodle,
  WavyLinesDoodle,
  AbstractShapeDoodle,
  HandPrintDoodle,
  ArrowDoodle,
  SparkleDoodle,
} from "@/components/ui/doodles";

interface AppCardProps {
  title: string;
  category: string;
  responses: number;
  created: string;
  status: "Active" | "Closed" | "Draft";
  doodleColor?: string;
  badge?: string;
}

export const AppCard: React.FC<AppCardProps> = ({
  title,
  category,
  responses,
  created,
  status,
  doodleColor = "#22c55e", // Default green
  badge,
}) => {
  // Randomly select doodles for variety
  const getRandomDoodles = () => {
    const doodles = [
      <CurvedDoodle
        key="curved"
        color={doodleColor}
        className="absolute w-16 h-8 top-4 right-4 opacity-30"
      />,
      <TriangleDoodle
        key="triangle"
        color={doodleColor}
        className="absolute w-8 h-8 top-2 left-2 opacity-40"
      />,
      <BlobDoodle
        key="blob"
        color={doodleColor}
        className="absolute w-12 h-12 top-0 right-0 opacity-25"
      />,
      <WavyLinesDoodle
        key="wavy"
        color={doodleColor}
        className="absolute w-20 h-6 bottom-20 left-4 opacity-30"
      />,
      <AbstractShapeDoodle
        key="abstract"
        color={doodleColor}
        className="absolute w-14 h-10 top-8 left-8 opacity-25"
      />,
      <ArrowDoodle
        key="arrow"
        color={doodleColor}
        className="absolute w-12 h-4 bottom-12 right-8 opacity-40"
      />,
      <SparkleDoodle
        key="sparkle"
        color={doodleColor}
        className="absolute w-6 h-6 top-6 right-12 opacity-50"
      />,
    ];

    // Return 2-3 random doodles
    const shuffled = doodles.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 2) + 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-red-100 text-red-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white  hover:shadow-md transition-shadow duration-200 w-64 h-56">
      <div className="p-5 h-full flex flex-col justify-center relative">
        {/* Background doodles */}
        {getRandomDoodles()}

        {/* Hand print doodle at bottom right */}
        <HandPrintDoodle
          color={doodleColor}
          className="absolute w-10 h-12 bottom-2 right-2 opacity-15"
        />

        <div className="flex justify-between items-start">
          <div className="mb-4 z-10 relative">
            <Badge
              className={`${getStatusColor(status)} text-xs px-2 py-1 border-0`}
            >
              {status}
            </Badge>
          </div>
          <div className="rounded-full hover:shadow-md hover:bg-blue-100 text-blue-300 border-2 border-black-300 p-2 cursor-pointer shadow-xs">
            <PencilIcon className="h-5 w-5 text-blue-400 z-10" />
          </div>
        </div>

        {/* Category */}
        <div className="text-xs text-gray-500 mb-2 z-10 relative">
          {category}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-4 z-10 relative">
          {title}
        </h3>

        {/* Status Badge */}

        {/* Form Stats */}
        <div className="z-10 relative">
          <div className="flex justify-between items-center text-xs text-gray-600">
            <div className="flex flex-col items-center">
              <div className="font-medium text-gray-500 mb-1">Responses</div>
              <div className="font-bold text-gray-900 text-sm">{responses}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-medium text-gray-500 mb-1">Created</div>
              <div className="font-semibold text-gray-700 text-sm">
                {created}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-medium text-gray-500 mb-1">Status</div>
              <div
                className={`font-semibold text-sm ${
                  status === "Active"
                    ? "text-green-600"
                    : status === "Closed"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {status}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
