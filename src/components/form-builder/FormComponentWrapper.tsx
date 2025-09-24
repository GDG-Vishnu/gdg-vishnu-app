import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FormalNames } from "@/constants";
import { getFieldIcon } from "@/utils";
import { FieldType } from "@prisma/client";
import { Trash, Settings, ChevronDown } from "lucide-react";

// Helper component for labels with required indicator
interface LabelWithRequiredProps {
  children: React.ReactNode;
  isRequired?: boolean;
  className?: string;
}

export const LabelWithRequired: React.FC<LabelWithRequiredProps> = ({
  children,
  isRequired = false,
  className = "block mb-1",
}) => {
  return (
    <label className={className}>
      {children}
      {isRequired && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

interface FormComponentWrapperProps {
  fieldType: FieldType;
  children:
    | React.ReactNode
    | ((props: { isRequired: boolean }) => React.ReactNode); // Preview component
  configurationContent: React.ReactNode; // Configuration form content
  onSave?: () => void;
  onDelete?: () => void;
  onRequiredChange?: (required: boolean) => void;
  isRequired?: boolean;
}

const FormComponentWrapper: React.FC<FormComponentWrapperProps> = ({
  fieldType,
  children,
  configurationContent,
  onSave,
  onDelete,
  onRequiredChange,
  isRequired = false,
}) => {
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);

  return (
    <div className="flex flex-col items-center w-full bg-transparent">
      {/* Preview Section */}
      <div className="w-full flex flex-col gap-2 bg-muted/50 p-4 rounded-2xl border border-border relative">
        {/* Settings Button - positioned in top-right corner */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0 opacity-60 hover:opacity-100"
          onClick={() => setIsConfigOpen(!isConfigOpen)}
        >
          <Settings className="h-4 w-4" />
        </Button>

        {/* Preview Content */}
        {typeof children === "function" ? children({ isRequired }) : children}
      </div>

      {/* Connector Line */}

      {/* Configuration Section - Collapsible */}
      {/* <Collapsible
        open={isConfigOpen}
        onOpenChange={setIsConfigOpen}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center bg-accent p-1 rounded">
                {React.createElement(getFieldIcon(fieldType), {
                  className: "h-5 w-5",
                })}
              </div>
              <span className="font-medium">{FormalNames[fieldType]}</span>
              <span className="text-sm text-muted-foreground">
                Configuration
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isConfigOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-2">
          
        </CollapsibleContent>
      </Collapsible> */}
      {isConfigOpen && (
        <>
          <div className="w-0.5 bg-muted h-2" />
          <div className="flex flex-col gap-5 w-full bg-muted/50 p-6 rounded-2xl border border-border">
            {/* Field Type and Required Toggle */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center bg-accent p-1 rounded">
                  {React.createElement(getFieldIcon(fieldType), {
                    className: "h-5 w-5",
                  })}
                </div>
                <span className="font-medium">{FormalNames[fieldType]}</span>
              </div>
              <div className="flex items-center gap-3">
                <h3 className="font-medium">Required</h3>
                <Switch
                  checked={isRequired}
                  onCheckedChange={onRequiredChange}
                />
              </div>
            </div>

            {/* Configuration Content */}
            <div className="flex flex-col bg-muted/100 border gap-3 p-4 rounded-2xl">
              {configurationContent}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="flex items-center gap-2 bg-destructive/15 hover:bg-destructive/25 transition-all rounded-md p-2"
              >
                <Trash className="text-destructive h-5 w-5" />
              </Button>
              <Button size="sm" onClick={onSave}>
                Save
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FormComponentWrapper;
