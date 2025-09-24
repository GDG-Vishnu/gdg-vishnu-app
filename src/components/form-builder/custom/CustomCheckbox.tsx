import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import React from "react";
import FormComponentWrapper, {
  LabelWithRequired,
} from "../FormComponentWrapper";

const CustomCheckbox = () => {
  const defaultValues = defaultFieldConfig[FieldType.CHECKBOX];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [isRequired, setIsRequired] = React.useState(false);

  const handleSave = () => {
    console.log("Saving checkbox configuration:", {
      label: labelValue,
      required: isRequired,
    });
  };

  const handleDelete = () => {
    console.log("Deleting checkbox component");
  };

  const previewContent = ({ isRequired }: { isRequired: boolean }) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="preview-checkbox" />
      <LabelWithRequired
        isRequired={isRequired}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {labelValue || defaultValues.label}
      </LabelWithRequired>
    </div>
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
      fieldType={FieldType.CHECKBOX}
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

export default CustomCheckbox;
