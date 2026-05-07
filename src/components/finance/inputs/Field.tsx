"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, hint, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  hint?: string;
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
  className?: string;
}

export function NumberField({
  id,
  label,
  value,
  onChange,
  hint,
  step,
  min,
  max,
  suffix,
  className,
}: NumberFieldProps) {
  return (
    <Field label={label} htmlFor={id} hint={hint} className={className}>
      <div className="relative">
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          max={max}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const n = e.target.valueAsNumber;
            onChange(Number.isFinite(n) ? n : 0);
          }}
          className={cn("tabular-nums", suffix && "pr-12")}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </Field>
  );
}
