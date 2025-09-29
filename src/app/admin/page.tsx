"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { PageLoading } from "@/components/ui/loading-fallbacks";

const DashboardPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/admin/dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <PageLoading message="Redirecting to dashboard..." />;
};

export default DashboardPage;
