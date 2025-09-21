import React from "react";
import { AppCard } from "@/components/ui/app-card";
import GradientCard from "@/components/global/GradientCard";

const FormsPage = () => {
  const formCards = [
    {
      title: "Event Registration",
      category: "Registration",
      responses: 234,
      created: "Sep 15",
      status: "Active" as const,
      doodleColor: "#3b82f6", // Blue
      badge: "Free",
    },
    {
      title: "Contact Form",
      category: "Contact",
      responses: 156,
      created: "Sep 10",
      status: "Active" as const,
      doodleColor: "#22c55e", // Green
      badge: "Free",
    },
    {
      title: "Survey Builder",
      category: "Survey",
      responses: 89,
      created: "Sep 8",
      status: "Draft" as const,
      doodleColor: "#eab308", // Yellow
      badge: "Free",
    },
    {
      title: "Feedback Form",
      category: "Feedback",
      responses: 312,
      created: "Sep 5",
      status: "Active" as const,
      doodleColor: "#ef4444", // Red
      badge: "Free",
    },
    {
      title: "User Registration",
      category: "Registration",
      responses: 567,
      created: "Aug 28",
      status: "Active" as const,
      doodleColor: "#8b5cf6", // Purple
      badge: "Free",
    },
    {
      title: "Photo Upload",
      category: "Upload",
      responses: 45,
      created: "Aug 25",
      status: "Closed" as const,
      doodleColor: "#f97316", // Orange
      badge: "Free",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Form Templates
        </h1>
        <p className="text-gray-600">
          Choose from our collection of beautifully designed form templates
        </p>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {formCards.map((card, index) => (
          <AppCard
            key={index}
            title={card.title}
            category={card.category}
            responses={card.responses}
            created={card.created}
            status={card.status}
            doodleColor={card.doodleColor}
            badge={card.badge}
          />
        ))}
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <GradientCard />
        <GradientCard variant="green" />
        <GradientCard variant="yellow" />
        <GradientCard variant="red" />
      </div>
    </div>
  );
};

export default FormsPage;
