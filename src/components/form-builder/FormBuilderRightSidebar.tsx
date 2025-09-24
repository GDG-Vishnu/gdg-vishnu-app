"use client";

import React from "react";
import { fieldTypes, type FieldType } from "@/constants";
import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
import { getFieldIcon } from "@/utils";

interface FormBuilderRightSidebarProps {
  onFieldSelect?: (fieldType: FieldType) => void;
  className?: string;
}

export const FormBuilderRightSidebar: React.FC<
  FormBuilderRightSidebarProps
> = ({ onFieldSelect, className }) => {
  // const [searchTerm, setSearchTerm] = useState("");

  // const filteredFieldTypes = fieldTypes.filter((field) =>
  //   field.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // For now, show all field types since search is disabled
  const filteredFieldTypes = fieldTypes;

  // Group field types by section
  const groupedFieldTypes = filteredFieldTypes.reduce((acc, field) => {
    if (!acc[field.section]) {
      acc[field.section] = [];
    }
    acc[field.section].push(field);
    return acc;
  }, {} as Record<string, FieldType[]>);

  const handleFieldClick = (fieldType: FieldType) => {
    onFieldSelect?.(fieldType);
  };

  // Map field types to appropriate icons/labels

  // Get random Google color for icons
  const getRandomColor = (fieldName: string) => {
    const colors = [
      "text-blue-500",
      "text-red-500",
      "text-green-500",
      "text-yellow-500",
    ];

    // Use field name to ensure consistent color for same field type
    const hash = fieldName.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className={cn(
        "w-80 border-l bg-background border-border flex flex-col h-full",
        className
      )}
    >
      {/* Header with Search */}
      {/* <div className="p-4 border-b bg-white flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div> */}

      {/* Field Types Grid */}
      <ScrollArea className="flex-1 h-0">
        <div className="p-4">
          {filteredFieldTypes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No components found</p>
              <p className="text-sm">Try adjusting your search</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedFieldTypes).map(([section, fields]) => (
                <div key={section} className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    {section}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {fields.map((fieldType) => (
                      <button
                        key={fieldType.name}
                        onClick={() => handleFieldClick(fieldType)}
                        className={cn(
                          "relative flex items-center justify-start p-3 bg-card border border-border rounded-lg cursor-pointer hover:border-primary hover:shadow-sm transition-all duration-200 shadow-xs",
                          "group w-full text-left hover:bg-muted"
                        )}
                      >
                        {fieldType.isNew && (
                          <Badge
                            variant="secondary"
                            className="absolute top-1 right-1 text-xs bg-primary/10 text-primary px-1 py-0"
                          >
                            New
                          </Badge>
                        )}

                        <div className="mr-2 group-hover:scale-110 transition-transform flex-shrink-0">
                          {React.createElement(getFieldIcon(fieldType.type), {
                            className: `w-4 h-4 
                            `,
                            // ${getRandomColor(
                            //   fieldType.name
                            // )}
                          })}
                        </div>

                        <span className="text-xs font-medium text-foreground truncate">
                          {fieldType.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
