"use client";

import { useParams } from "next/navigation";
import React from "react";

const FormBuilderPage = () => {
  const { id } = useParams();

  return (
    <div className="h-full p-6">{`Form Builder Page for form id: ${id}`}</div>
  );
};

export default FormBuilderPage;
