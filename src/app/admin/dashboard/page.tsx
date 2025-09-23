import { SectionLoading } from "@/components/ui/loading-fallbacks";
import React from "react";

const Dashboard = () => {
  return (
    <div className="w-full h-full min-h-[80vh]">
      <SectionLoading message="Loading dashboard content..." minHeight="80vh" />
    </div>
  );
};

export default Dashboard;
