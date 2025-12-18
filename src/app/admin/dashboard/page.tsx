"use client";

import { SmartDatetimeInput } from "@/components/ui/extension/smart-date-time";
import { SectionLoading } from "@/components/ui/loading-fallbacks";
import React from "react";

const Dashboard = () => {
  return (
    <div className="w-full h-full">
      <div className="w-2xl mx-auto p-4">
        <SmartDatetimeInput onValueChange={() => {}} />
      </div>
    </div>
  );
};

export default Dashboard;
