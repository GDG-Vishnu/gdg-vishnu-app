import React from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  return <div className="min-h-screen">{children}</div>;
};

export default ClientLayout;
