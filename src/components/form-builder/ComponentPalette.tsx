"use client";

import React from "react";
import { FieldType } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  getFieldTypeIcon,
  getFieldTypeLabel,
  getFieldTypeDescription,
} from "./FormBuilderContext";
import { cn } from "@/lib/utils";

interface FieldTypeGroup {
  name: string;
  description: string;
  types: FieldType[];
}

const fieldTypeGroups: FieldTypeGroup[] = [
  {
    name: "Basic Inputs",
    description: "Standard text and input fields",
    types: [
      FieldType.INPUT,
      FieldType.TEXTAREA,
      FieldType.PASSWORD,
      FieldType.PHONE,
    ],
  },
  {
    name: "Selection",
    description: "Choose from options and selections",
    types: [
      FieldType.CHECKBOX,
      FieldType.RADIO,
      FieldType.SELECT,
      FieldType.COMBOBOX,
      FieldType.MULTISELECT,
      FieldType.SWITCH,
    ],
  },
  {
    name: "Date & Time",
    description: "Date and time picker components",
    types: [FieldType.DATE, FieldType.DATETIME, FieldType.SMART_DATETIME],
  },
  {
    name: "Advanced",
    description: "Specialized input components",
    types: [
      FieldType.FILE,
      FieldType.OTP,
      FieldType.LOCATION,
      FieldType.SIGNATURE,
      FieldType.SLIDER,
      FieldType.TAGS,
    ],
  },
];

interface DraggableFieldTypeProps {
  fieldType: FieldType;
  onAddField?: (fieldType: FieldType) => void;
  className?: string;
}

function DraggableFieldType({
  fieldType,
  onAddField,
  className,
}: DraggableFieldTypeProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: "FIELD_TYPE",
        fieldType: fieldType,
      })
    );
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleClick = () => {
    onAddField?.(fieldType);
  };

  return (
    <Card
      className={cn(
        "cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 border-dashed border-2 hover:border-primary/50 bg-background/50 hover:bg-background",
        className
      )}
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="text-2xl flex-shrink-0 mt-0.5">
            {getFieldTypeIcon(fieldType)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-foreground truncate">
              {getFieldTypeLabel(fieldType)}
            </h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {getFieldTypeDescription(fieldType)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface FieldTypeGroupProps {
  group: FieldTypeGroup;
  onAddField?: (fieldType: FieldType) => void;
}

function FieldTypeGroupComponent({ group, onAddField }: FieldTypeGroupProps) {
  return (
    <div className="mb-6">
      <div className="mb-3">
        <h3 className="font-semibold text-sm text-foreground mb-1">
          {group.name}
        </h3>
        <p className="text-xs text-muted-foreground">{group.description}</p>
      </div>
      <div className="space-y-2">
        {group.types.map((fieldType) => (
          <DraggableFieldType
            key={fieldType}
            fieldType={fieldType}
            onAddField={onAddField}
          />
        ))}
      </div>
    </div>
  );
}

interface ComponentPaletteProps {
  onAddField?: (fieldType: FieldType) => void;
  className?: string;
}

export function ComponentPalette({
  onAddField,
  className,
}: ComponentPaletteProps) {
  return (
    <div className={cn("h-full bg-muted/30 border-l", className)}>
      <div className="p-4 border-b bg-background/50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-base text-foreground">
            Components
          </h2>
          <Badge variant="secondary" className="text-xs">
            {fieldTypeGroups.reduce(
              (acc, group) => acc + group.types.length,
              0
            )}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Drag components to add fields or click to add to the last section
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4">
          {fieldTypeGroups.map((group, index) => (
            <React.Fragment key={group.name}>
              <FieldTypeGroupComponent group={group} onAddField={onAddField} />
              {index < fieldTypeGroups.length - 1 && (
                <Separator className="my-4" />
              )}
            </React.Fragment>
          ))}

          <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-dashed">
            <h4 className="font-medium text-sm text-foreground mb-2">
              💡 Quick Tips
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Drag components directly to sections</li>
              <li>• Click components to add to active section</li>
              <li>• Configure fields after adding them</li>
              <li>• Use required validation for important fields</li>
            </ul>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// Individual field type components for more detailed palette
interface DetailedFieldTypeProps {
  fieldType: FieldType;
  isActive?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
}

export function DetailedFieldType({
  fieldType,
  isActive,
  onClick,
  onDragStart,
}: DetailedFieldTypeProps) {
  return (
    <div
      className={cn(
        "group relative p-4 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer",
        "hover:border-primary/50 hover:bg-primary/5",
        isActive && "border-primary bg-primary/10",
        "bg-background/50"
      )}
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl flex-shrink-0">
          {getFieldTypeIcon(fieldType)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground mb-1">
            {getFieldTypeLabel(fieldType)}
          </h3>
          <p className="text-sm text-muted-foreground">
            {getFieldTypeDescription(fieldType)}
          </p>

          {/* Field type specific features */}
          <div className="flex flex-wrap gap-1 mt-2">
            {getFieldTypeFeatures(fieldType).map((feature, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-2 py-0"
              >
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Drag indicator */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="text-xs text-muted-foreground bg-background px-2 py-1 rounded border">
          Drag or Click
        </div>
      </div>
    </div>
  );
}

// Helper function to get field type features
function getFieldTypeFeatures(fieldType: FieldType): string[] {
  const features: Record<FieldType, string[]> = {
    [FieldType.INPUT]: ["Text", "Validation", "Placeholder"],
    [FieldType.TEXTAREA]: ["Multiline", "Word Count", "Rich Text"],
    [FieldType.PASSWORD]: ["Secure", "Strength Check", "Confirmation"],
    [FieldType.PHONE]: ["Formatting", "International", "Validation"],
    [FieldType.CHECKBOX]: ["Multiple", "Options", "Custom Values"],
    [FieldType.RADIO]: ["Single Choice", "Options", "Required"],
    [FieldType.SELECT]: ["Dropdown", "Options", "Search"],
    [FieldType.COMBOBOX]: ["Searchable", "Custom Values", "Options"],
    [FieldType.MULTISELECT]: ["Multiple", "Limit", "Tags"],
    [FieldType.SWITCH]: ["Toggle", "Boolean", "Default State"],
    [FieldType.DATE]: ["Calendar", "Range", "Format"],
    [FieldType.DATETIME]: ["Date + Time", "Timezone", "Format"],
    [FieldType.SMART_DATETIME]: ["Natural Language", "Smart Parse", "Flexible"],
    [FieldType.FILE]: ["Upload", "Multiple", "Size Limit", "Type Filter"],
    [FieldType.OTP]: ["Security", "6-Digit", "Verification"],
    [FieldType.LOCATION]: ["Map", "GPS", "Address", "Geocoding"],
    [FieldType.SIGNATURE]: ["Digital", "Touch", "Image Export"],
    [FieldType.SLIDER]: ["Range", "Steps", "Visual", "Min/Max"],
    [FieldType.TAGS]: ["Multiple", "Autocomplete", "Custom Values"],
  };

  return features[fieldType] || ["Custom"];
}

export default ComponentPalette;
