import React from "react";
import { formatDistanceToNow } from "date-fns";
import { FileText, Eye, User, Calendar } from "lucide-react";

type FormData = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  creator: {
    name: string | null;
    email: string;
  } | null;
  _count: {
    sections: number;
    submissions: number;
  };
};

type Props = {
  variant?: "blue" | "green" | "yellow" | "red" | "purple" | "orange";
  form?: FormData;
  onClick?: () => void;
};

const GradientCard = ({ variant = "blue", form, onClick }: Props) => {
  const getGradientClass = (variant: string) => {
    switch (variant) {
      case "blue":
        return "bg-gradient-to-tr from-blue-300 via-blue-100 to-white";
      case "green":
        return "bg-gradient-to-tr from-green-300 via-green-100 to-white";
      case "yellow":
        return "bg-gradient-to-tr from-yellow-300 via-yellow-100 to-white";
      case "red":
        return "bg-gradient-to-tr from-red-300 via-red-100 to-white";
      case "purple":
        return "bg-gradient-to-tr from-purple-300 via-purple-100 to-white";
      case "orange":
        return "bg-gradient-to-tr from-orange-300 via-orange-100 to-white";
      default:
        return "bg-gradient-to-tr from-blue-300 via-blue-100 to-white";
    }
  };

  const getBorderColor = (variant: string) => {
    switch (variant) {
      case "blue":
        return "border-blue-200";
      case "green":
        return "border-green-200";
      case "yellow":
        return "border-yellow-200";
      case "red":
        return "border-red-200";
      case "purple":
        return "border-purple-200";
      case "orange":
        return "border-orange-200";
      default:
        return "border-blue-200";
    }
  };

  if (!form) {
    return (
      <div
        className={`${getGradientClass(
          variant
        )} w-72 h-48 p-4 rounded-sm border ${getBorderColor(
          variant
        )} relative overflow-hidden`}
      >
        <div className="relative z-10 flex items-center justify-center h-full">
          <span className="text-gray-600">No form data</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${getGradientClass(
        variant
      )} w-72 h-48 p-4 rounded-lg border ${getBorderColor(
        variant
      )} relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]`}
      onClick={onClick}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4">
          <FileText size={40} className="text-gray-700" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Header */}
        <div>
          <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2">
            {form.name}
          </h3>
          {form.description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {form.description}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Eye size={14} />
              <span>{form._count.submissions} responses</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <FileText size={14} />
              <span>{form._count.sections} sections</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <User size={12} />
              <span>{form.creator?.name || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>
                {formatDistanceToNow(new Date(form.updatedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientCard;
