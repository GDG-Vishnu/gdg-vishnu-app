import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import React from "react";
import FormComponentWrapper from "../FormComponentWrapper";

interface CustomSliderProps {
  fieldId?: string;
  sectionId?: string;
}

const CustomSlider: React.FC<CustomSliderProps> = ({ fieldId, sectionId }) => {
  const defaultValues = defaultFieldConfig[FieldType.SLIDER];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [value, setValue] = React.useState([50]);
  const [minValue, setMinValue] = React.useState(0);
  const [maxValue, setMaxValue] = React.useState(100);
  const [step, setStep] = React.useState(1);
  const [isRequired, setIsRequired] = React.useState(false);

  const handleSave = async (): Promise<void> => {
    const fieldData = {
      fieldId,
      sectionId,
      type: FieldType.SLIDER,
      label: labelValue,
      value,
      min: minValue,
      max: maxValue,
      step,
      required: isRequired,
    };

    console.log("Saving slider configuration:", fieldData);

    // Here you would typically call a server action or API
    // For now, we'll simulate a save operation
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Slider field saved successfully!");
        resolve();
      }, 500);
    });
  };

  const previewContent = (
    <>
      <label className="block mb-3">{labelValue || defaultValues.label}</label>
      <div className="space-y-2">
        <Slider
          value={value}
          onValueChange={setValue}
          min={minValue}
          max={maxValue}
          step={step}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{minValue}</span>
          <span className="font-medium">{value[0]}</span>
          <span>{maxValue}</span>
        </div>
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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1">Min Value</label>
          <Input
            type="number"
            className="border p-2"
            value={minValue}
            onChange={(e) => setMinValue(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block mb-1">Max Value</label>
          <Input
            type="number"
            className="border p-2"
            value={maxValue}
            onChange={(e) => setMaxValue(Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <label className="block mb-1">Step Size</label>
        <Input
          type="number"
          className="border p-2"
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          min={1}
        />
      </div>

      <div>
        <label className="block mb-1">Default Value</label>
        <Input
          type="number"
          className="border p-2"
          value={value[0]}
          onChange={(e) => setValue([Number(e.target.value)])}
          min={minValue}
          max={maxValue}
        />
      </div>
    </>
  );

  return (
    <FormComponentWrapper
      fieldId={fieldId}
      sectionId={sectionId}
      fieldType={FieldType.SLIDER}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomSlider;
