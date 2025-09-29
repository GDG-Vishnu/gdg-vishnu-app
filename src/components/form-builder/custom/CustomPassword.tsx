import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/extension/password";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import React from "react";
import FormComponentWrapper from "../FormComponentWrapper";

const CustomPassword = () => {
  const defaultValues = defaultFieldConfig[FieldType.PASSWORD];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [placeholderValue, setPlaceholderValue] =
    React.useState("Enter password...");
  const [isRequired, setIsRequired] = React.useState(false);

  const handleSave = () => {
    console.log("Saving password configuration:", {
      label: labelValue,
      placeholder: placeholderValue,
      required: isRequired,
    });
  };

  const handleDelete = () => {
    console.log("Deleting password component");
  };

  const previewContent = (
    <>
      <label className="block">{labelValue || defaultValues.label}</label>
      <PasswordInput className="w-full" placeholder={placeholderValue} />
    </>
  );

  const configurationContent = (
    <>
      <div>
        <label className="block mb-1">Label</label>
        <Input
          type="text"
          className="border p-2"
          value={labelValue}
          onChange={(e) => setLabelValue(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1">Placeholder</label>
        <Input
          type="text"
          className="border p-2"
          value={placeholderValue}
          onChange={(e) => setPlaceholderValue(e.target.value)}
        />
      </div>
    </>
  );

  return (
    <FormComponentWrapper
      fieldType={FieldType.PASSWORD}
      onSave={handleSave}
      onDelete={handleDelete}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomPassword;
