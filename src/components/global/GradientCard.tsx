import React from "react";

type Props = {
  variant?: "blue" | "green" | "yellow" | "red";
};

const GradientCard = ({ variant = "blue" }: Props) => {
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
      default:
        return "bg-gradient-to-tr from-blue-300 via-blue-100 to-white";
    }
  };

  return (
    <div
      className={`${getGradientClass(
        variant
      )} w-72 h-48 p-4 rounded-sm relative overflow-hidden`}
    >
      {/* Mist overlay effect */}
      {/* <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/25 to-white/10 opacity-80"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-white/50 via-white/20 to-white/35 opacity-60"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/30 to-white/45 opacity-70"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/40 opacity-50"></div> */}

      {/* Content */}
      <div className="relative z-10">GradientCard</div>
    </div>
  );
};

export default GradientCard;
