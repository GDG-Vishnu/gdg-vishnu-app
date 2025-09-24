import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import React from "react";
import FormComponentWrapper from "../FormComponentWrapper";

const CustomSwitch = () => {
  const defaultValues = defaultFieldConfig[FieldType.SWITCH];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [checkedByDefault, setCheckedByDefault] = React.useState(false);
  const [isRequired, setIsRequired] = React.useState(false);

  const handleSave = () => {
    console.log("Saving switch configuration:", {
      label: labelValue,
      checkedByDefault,
      required: isRequired,
    });
  };

  const handleDelete = () => {
    console.log("Deleting switch component");
  };

  const previewContent = (
    <>
      <div className="flex items-center space-x-2">
        <Switch id="preview-switch" defaultChecked={checkedByDefault} />
        <Label htmlFor="preview-switch">
          {labelValue || defaultValues.label}
        </Label>
      </div>
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

      <div className="flex items-center justify-between">
        <label>Checked by Default</label>
        <Switch
          checked={checkedByDefault}
          onCheckedChange={setCheckedByDefault}
        />
      </div>
    </>
  );

  return (
    <FormComponentWrapper
      fieldType={FieldType.SWITCH}
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

export default CustomSwitch;