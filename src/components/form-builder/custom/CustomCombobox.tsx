import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import { Plus, X } from "lucide-react";
import React from "react";
import { UniversalCombobox } from "@/components/combobox/universal-combobox";
import FormComponentWrapper from "../FormComponentWrapper";

const CustomCombobox = () => {
  const defaultValues = defaultFieldConfig[FieldType.COMBOBOX];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [options, setOptions] = React.useState([
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
  ]);
  const [minFieldsRequired, setMinFieldsRequired] = React.useState(0);
  const [isRequired, setIsRequired] = React.useState(false);

  const addOption = () => {
    const newOption = {
      value: `option${options.length + 1}`,
      label: `Option ${options.length + 1}`,
    };
    setOptions([...options, newOption]);
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, label: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      label,
      value: label.toLowerCase().replace(/\s+/g, "_"),
    };
    setOptions(updatedOptions);
  };

  const handleSave = () => {
    console.log("Saving combobox configuration:", {
      label: labelValue,
      options,
      minFieldsRequired,
      required: isRequired,
    });
  };

  const handleDelete = () => {
    console.log("Deleting combobox component");
  };

  const previewContent = (
    <>
      <label className="block">{labelValue || defaultValues.label}</label>
      <UniversalCombobox
        options={options}
        placeholder="Select an option..."
        className="w-full"
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
        <div className="flex items-center justify-between mb-2">
          <label className="block">Options</label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addOption}
            className="flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Choice
          </Button>
        </div>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="text"
                className="border p-2 flex-1"
                value={option.label}
                onChange={(e) => updateOption(index, e.target.value)}
              />
              {options.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeOption(index)}
                  className="p-1 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="block mb-1">Min Fields Required</label>
        <Input
          type="number"
          className="border p-2"
          value={minFieldsRequired}
          min={0}
          max={options.length}
          onChange={(e) => setMinFieldsRequired(parseInt(e.target.value) || 0)}
        />
      </div>
    </>
  );

  return (
    <FormComponentWrapper
      fieldType={FieldType.COMBOBOX}
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

export default CustomCombobox;
