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
  const getGradientClass = () => {
    // Simple card background - white in light mode, dark in dark mode
    return "bg-card";
  };

  const getBorderColor = (variant: string) => {
    switch (variant) {
      case "blue":
        return "border-blue-300";
      case "green":
        return "border-green-300";
      case "yellow":
        return "border-yellow-300";
      case "red":
        return "border-red-300";
      case "purple":
        return "border-purple-300";
      case "orange":
        return "border-orange-300";
      default:
        return "border-blue-300";
    }
  };

  if (!form) {
    return (
      <div
        className={`${getGradientClass()} w-72 h-48 p-4 rounded-sm border ${getBorderColor(
          variant
        )} relative overflow-hidden`}
      >
        <div className="relative z-10 flex items-center justify-center h-full">
          <span className="text-muted-foreground">No form data</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${getGradientClass()} w-72 h-48 p-4 rounded-lg border ${getBorderColor(
        variant
      )} relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md `}
      onClick={onClick}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4">
          <FileText size={40} className="text-muted-foreground" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Header */}
        <div>
          <h3 className="font-semibold text-card-foreground text-lg mb-2 line-clamp-2">
            {form.name}
          </h3>
          {form.description && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {form.description}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye size={14} />
              <span>{form._count.submissions} responses</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <FileText size={14} />
              <span>{form._count.sections} sections</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
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
