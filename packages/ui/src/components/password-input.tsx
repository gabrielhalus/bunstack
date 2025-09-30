import type { MouseEvent } from "react";
import type z from "zod";

import { Check, Eye, EyeOff, X } from "lucide-react";
import React from "react";

import type { PasswordRules } from "@bunstack/ui/lib/passwords";

import { Button } from "@bunstack/ui/components/button";
import { Input } from "@bunstack/ui/components/input";
import { inferPasswordRules } from "@bunstack/ui/lib/passwords";
import { cn } from "@bunstack/ui/lib/utils";

export type PasswordInputProps = {
  schema?: z.ZodString;
  showRequirements?: boolean;
  onValidationChange?: (isValid: boolean) => void;
} & Omit<React.ComponentProps<"input">, "type">;

type RequirementStatus = {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  digits: boolean;
  specialChars: boolean;
};

function checkRequirements(password: string, rules: PasswordRules): RequirementStatus {
  return {
    length: rules.minLength ? password.length >= rules.minLength : true,
    uppercase: rules.minUppercase ? (password.match(/[A-Z]/g) || []).length >= rules.minUppercase : true,
    lowercase: rules.minLowercase ? (password.match(/[a-z]/g) || []).length >= rules.minLowercase : true,
    digits: rules.minDigits ? (password.match(/\d/g) || []).length >= rules.minDigits : true,
    specialChars: rules.minSpecialChars
      ? (password.match(/[^A-Z0-9]/gi) || []).length >= rules.minSpecialChars
      : true,
  };
}

const RequirementItem = React.memo<{
  label: string;
  satisfied: boolean;
  show: boolean;
}>(({ label, satisfied, show }) => {
  if (!show)
    return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm transition-colors duration-200",
        satisfied ? "text-green-600 dark:text-green-400" : "text-muted-foreground",
      )}
    >
      {satisfied
        ? (
            <Check className="size-3 text-green-600 dark:text-green-400" />
          )
        : (
            <X className="size-3 text-muted-foreground" />
          )}
      <span>{label}</span>
    </div>
  );
});

RequirementItem.displayName = "RequirementItem";

export function PasswordInput({ ref, className, schema, showRequirements = true, onValidationChange, onChange, value, ...props }: PasswordInputProps & { ref?: React.RefObject<HTMLInputElement | null> }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState(value?.toString() || "");

  const rules = React.useMemo(() => inferPasswordRules(schema), [schema]);

  // Memoize requirements checking to avoid unnecessary recalculations
  const requirements = React.useMemo(() => checkRequirements(password, rules), [password, rules]);

  const isValid = React.useMemo(() => {
    if (!schema)
      return true;
    const result = schema.safeParse(password);
    return result.success;
  }, [password, schema]);

  // Notify parent of validation changes
  React.useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  // Memoized toggle function
  const togglePasswordVisibility = React.useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword(prev => !prev);
  }, []);

  // Handle input changes
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setPassword(newValue);
      onChange?.(e);
    },
    [onChange],
  );

  // Memoize requirement labels to avoid recreating on every render
  const requirementLabels = React.useMemo(
    () => ({
      length: rules.minLength ? `At least ${rules.minLength} characters` : "",
      uppercase: rules.minUppercase
        ? `At least ${rules.minUppercase} uppercase letter${rules.minUppercase > 1 ? "s" : ""}`
        : "",
      lowercase: rules.minLowercase
        ? `At least ${rules.minLowercase} lowercase letter${rules.minLowercase > 1 ? "s" : ""}`
        : "",
      digits: rules.minDigits ? `At least ${rules.minDigits} digit${rules.minDigits > 1 ? "s" : ""}` : "",
      specialChars: rules.minSpecialChars
        ? `At least ${rules.minSpecialChars} special character${rules.minSpecialChars > 1 ? "s" : ""}`
        : "",
    }),
    [rules],
  );

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input {...props} type={!showPassword ? "password" : "text"} onChange={handleChange} data-slot="input" className="pr-7" />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-full hover:bg-transparent"
          aria-label={showPassword ? "Hide password" : "Show password"}
          type="button"
          tabIndex={-1}
          onClick={e => togglePasswordVisibility(e)}
        >
          {!showPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </Button>
      </div>
      {showRequirements && schema && (
        <div className="space-y-1 rounded-md border border-border bg-muted/30 p-3">
          <p className="text-sm font-medium text-foreground">Password requirements:</p>
          <div className="space-y-1">
            <RequirementItem
              label={requirementLabels.length}
              satisfied={requirements.length}
              show={!!rules.minLength}
            />
            <RequirementItem
              label={requirementLabels.uppercase}
              satisfied={requirements.uppercase}
              show={!!rules.minUppercase}
            />
            <RequirementItem
              label={requirementLabels.lowercase}
              satisfied={requirements.lowercase}
              show={!!rules.minLowercase}
            />
            <RequirementItem
              label={requirementLabels.digits}
              satisfied={requirements.digits}
              show={!!rules.minDigits}
            />
            <RequirementItem
              label={requirementLabels.specialChars}
              satisfied={requirements.specialChars}
              show={!!rules.minSpecialChars}
            />
          </div>
        </div>
      )}
    </div>
  );
}
