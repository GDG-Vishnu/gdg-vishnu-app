import { Input } from "@/components/ui/input";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import React from "react";
import FormComponentWrapper, {
  LabelWithRequired,
} from "../FormComponentWrapper";

interface CustomInputProps {
  fieldId?: string;
  sectionId?: string;
  initialData?: {
    label?: string;
    placeholder?: string;
    required?: boolean;
  };
}

const CustomInput: React.FC<CustomInputProps> = ({
  fieldId,
  sectionId,
  initialData,
}) => {
  const defaultValues = defaultFieldConfig[FieldType.INPUT];
  const [inputValue, setInputValue] = React.useState(
    initialData?.placeholder || defaultValues.placeholder
  );
  const [labelValue, setLabelValue] = React.useState(
    initialData?.label || defaultValues.label
  );
  const [isRequired, setIsRequired] = React.useState(
    initialData?.required || false
  );

  const handleSave = async (): Promise<void> => {
    const fieldData = {
      fieldId,
      sectionId,
      type: FieldType.INPUT,
      label: labelValue,
      placeholder: inputValue,
      required: isRequired,
    };

    console.log("Saving input configuration:", fieldData);

    // Here you would typically call a server action or API
    // For now, we'll simulate a save operation
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Input field saved successfully!");
        resolve();
      }, 500);
    });
  };

  const previewContent = ({ isRequired }: { isRequired: boolean }) => (
    <>
      <LabelWithRequired isRequired={isRequired}>
        {labelValue || defaultValues.label}
      </LabelWithRequired>
      <Input
        type="text"
        className="border p-2"
        placeholder={inputValue || defaultValues.placeholder}
      />
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
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
    </>
  );

  return (
    <FormComponentWrapper
      fieldId={fieldId}
      sectionId={sectionId}
      fieldType={FieldType.INPUT}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomInput;
