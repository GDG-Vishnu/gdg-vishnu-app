"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const DashboardPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/admin/dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div>DashboardPage</div>;
};

export default DashboardPage;
