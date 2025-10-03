import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/extension/phone-input";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import React from "react";
import FormComponentWrapper from "../FormComponentWrapper";

interface CustomPhoneProps {
  fieldId?: string;
  sectionId?: string;
}

const CustomPhone: React.FC<CustomPhoneProps> = ({ fieldId, sectionId }) => {
  const defaultValues = defaultFieldConfig[FieldType.PHONE];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [isRequired, setIsRequired] = React.useState(false);

  const handleSave = async (): Promise<void> => {
    const fieldData = {
      fieldId,
      sectionId,
      type: FieldType.PHONE,
      label: labelValue,
      required: isRequired,
    };

    console.log("Saving phone configuration:", fieldData);

    // Here you would typically call a server action or API
    // For now, we'll simulate a save operation
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Phone field saved successfully!");
        resolve();
      }, 500);
    });
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
      fieldId={fieldId}
      sectionId={sectionId}
      fieldType={FieldType.PHONE}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomPhone;
