import { FieldType } from "@prisma/client";
import React from "react";
import CustomComponents from "./custom";

type Props = {
  type: FieldType;
};

const FormComponentRender = (props: Props) => {
  switch (props.type) {
    case FieldType.INPUT:
      return <CustomComponents.Input />;
    case FieldType.TEXTAREA:
      return <CustomComponents.TextArea />;
    case FieldType.PASSWORD:
      return <CustomComponents.Password />;
    case FieldType.PHONE:
      return <CustomComponents.Phone />;
    case FieldType.CHECKBOX:
      return <CustomComponents.Checkbox />;
    case FieldType.RADIO:
      return <CustomComponents.Radio />;
    case FieldType.SELECT:
      return <CustomComponents.Select />;
    case FieldType.COMBOBOX:
      return <CustomComponents.Combobox />;
    case FieldType.MULTISELECT:
      return <CustomComponents.MultiSelect />;
    case FieldType.SWITCH:
      return <CustomComponents.Switch />;
    case FieldType.DATE:
      return <CustomComponents.Date />;
    case FieldType.DATETIME:
      return <CustomComponents.DateTime />;
    case FieldType.SMART_DATETIME:
      return <CustomComponents.SmartDateTime />;
    case FieldType.FILE:
      return <CustomComponents.File />;
    case FieldType.OTP:
      return <CustomComponents.Otp />;
    case FieldType.LOCATION:
      return <CustomComponents.Location />;
    case FieldType.SIGNATURE:
      return <CustomComponents.Signature />;
    case FieldType.SLIDER:
      return <CustomComponents.Slider />;
    case FieldType.TAGS:
      return <CustomComponents.Tags />;
    default:
      return <div>Unknown Component</div>;
  }
};

export default FormComponentRender;
