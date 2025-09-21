import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const FormBuilderRedirect = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/forms");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div>FormBuilderRedirect</div>;
};

export default FormBuilderRedirect;
