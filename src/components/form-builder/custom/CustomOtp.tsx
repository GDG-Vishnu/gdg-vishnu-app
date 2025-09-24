import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { defaultFieldConfig, FormalNames } from "@/constants";
import { getFieldIcon } from "@/utils";
import { FieldType } from "@prisma/client";
import { Trash } from "lucide-react";
import React from "react";

const CustomOtp = () => {
  const defaultValues = defaultFieldConfig[FieldType.OTP];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [otpLength, setOtpLength] = React.useState(6);

  return (
    <div className="flex flex-col items-center w-full bg-transparent">
      <div className="w-full flex flex-col gap-2 bg-muted/50 p-4 rounded-2xl border border-border">
        <label className="block">{labelValue || defaultValues.label}</label>
        <InputOTP maxLength={otpLength}>
          <InputOTPGroup>
            {Array.from({ length: otpLength }, (_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="w-0.5 bg-muted h-2" />
      <div className="flex flex-col gap-5 w-full bg-muted/50 p-6 rounded-2xl border border-border">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center bg-accent p-1 rounded">
              {React.createElement(getFieldIcon(FieldType.OTP), {
                className: "h-5 w-5",
              })}
            </div>
            <span className="font-medium">{FormalNames[FieldType.OTP]}</span>
          </div>
          <div className="flex items-center gap-3">
            <h3 className="font-medium">Required</h3>
            <Switch />
          </div>
        </div>
        <div className="flex flex-col bg-muted/100 border gap-3 p-4 rounded-2xl">
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
            <label className="block mb-1">OTP Length</label>
            <Input
              type="number"
              className="border p-2"
              value={otpLength}
              min={4}
              max={8}
              onChange={(e) => setOtpLength(parseInt(e.target.value) || 6)}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 bg-destructive/15 hover:bg-destructive/25 transition-all rounded-md p-2 cursor-pointer">
            <Trash className="text-destructive h-5 w-5" />
          </div>
          <div>
            <Button size="sm">Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomOtp;
