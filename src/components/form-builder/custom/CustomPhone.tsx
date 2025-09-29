import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/extension/phone-input";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import React from "react";
import FormComponentWrapper from "../FormComponentWrapper";

const CustomPhone = () => {
  const defaultValues = defaultFieldConfig[FieldType.PHONE];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [isRequired, setIsRequired] = React.useState(false);

  const handleSave = () => {
    console.log("Saving phone configuration:", {
      label: labelValue,
      required: isRequired,
    });
  };

  const handleDelete = () => {
    console.log("Deleting phone component");
  };

  const previewContent = (
    <>
      <label className="block">{labelValue || defaultValues.label}</label>
      <PhoneInput placeholder="Enter phone number" className="w-full" />
    </>
  );

  const configurationContent = (
    <div>
      <label className="block mb-1">Label</label>
      <Input
        type="text"
        className="border p-2"
        value={labelValue}
        onChange={(e) => setLabelValue(e.target.value)}
      />
    </div>
  );

  return (
    <FormComponentWrapper
      fieldType={FieldType.PHONE}
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

export default CustomPhone;
