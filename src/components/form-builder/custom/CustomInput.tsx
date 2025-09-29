import { Input } from "@/components/ui/input";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import React from "react";
import FormComponentWrapper, {
  LabelWithRequired,
} from "../FormComponentWrapper";

const CustomInput = () => {
  const defaultValues = defaultFieldConfig[FieldType.INPUT];
  const [inputValue, setInputValue] = React.useState(defaultValues.placeholder);
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [isRequired, setIsRequired] = React.useState(false);

  const handleSave = () => {
    console.log("Saving input configuration:", {
      label: labelValue,
      placeholder: inputValue,
      required: isRequired,
    });
  };

  const handleDelete = () => {
    console.log("Deleting input component");
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
      fieldType={FieldType.INPUT}
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

export default CustomInput;
