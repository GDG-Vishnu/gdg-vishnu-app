import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/extension/password";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import React from "react";
import FormComponentWrapper from "../FormComponentWrapper";

interface CustomPasswordProps {
  fieldId?: string;
  sectionId?: string;
}

const CustomPassword: React.FC<CustomPasswordProps> = ({
  fieldId,
  sectionId,
}) => {
  const defaultValues = defaultFieldConfig[FieldType.PASSWORD];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [placeholderValue, setPlaceholderValue] =
    React.useState("Enter password...");
  const [isRequired, setIsRequired] = React.useState(false);

  const handleSave = async (): Promise<void> => {
    const fieldData = {
      fieldId,
      sectionId,
      type: FieldType.PASSWORD,
      label: labelValue,
      placeholder: placeholderValue,
      required: isRequired,
    };

    console.log("Saving password configuration:", fieldData);

    // Here you would typically call a server action or API
    // For now, we'll simulate a save operation
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Password field saved successfully!");
        resolve();
      }, 500);
    });
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
      fieldId={fieldId}
      sectionId={sectionId}
      fieldType={FieldType.PASSWORD}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomPassword;
