import z from "zod";

export type PasswordRules = {
  minLength?: number;
  maxLength?: number;
  minUppercase?: number;
  minLowercase?: number;
  minDigits?: number;
  minSpecialChars?: number;
};

export function inferPasswordRules(schema?: z.ZodString): PasswordRules {
  if (!schema)
    return {};

  const rules: PasswordRules = {};

  // Get the schema definition
  const schemaDef = z.toJSONSchema(schema);

  // Handle min/max
  if ("minLength" in schemaDef) {
    rules.minLength = schemaDef.minLength;
  }
  if ("maxLength" in schemaDef) {
    rules.maxLength = schemaDef.maxLength;
  }

  // Handle regex patterns
  if (Array.isArray(schemaDef.allOf)) {
    for (const sub of schemaDef.allOf) {
      if (sub.pattern) {
        const pattern = sub.pattern as string;

        if (pattern.includes("[A-Z]") || pattern.includes("\\p{Lu}")) {
          rules.minUppercase = 1;
        }
        if (pattern.includes("[a-z]") || pattern.includes("\\p{Ll}")) {
          rules.minLowercase = 1;
        }
        if (pattern.includes("\\d") || pattern.includes("[0-9]")) {
          rules.minDigits = 1;
        }
        if (
          pattern.includes("[!@#$%^&*()") // your special set
          || pattern.includes("[^A-Za-z0-9]")
          || pattern.includes("\\W")
        ) {
          rules.minSpecialChars = 1;
        }
      }
    }
  }

  // Parse superRefine and refine methods for custom validations
  // This handles cases where schema uses .refine() for character requirements
  const schemaString = schema.toString();

  // Try to detect refinements by parsing error messages or common patterns
  if (schemaString.includes("uppercase") || schemaString.includes("capital")) {
    rules.minUppercase = rules.minUppercase || 1;
  }
  if (schemaString.includes("lowercase")) {
    rules.minLowercase = rules.minLowercase || 1;
  }
  if (schemaString.includes("digit") || schemaString.includes("number")) {
    rules.minDigits = rules.minDigits || 1;
  }
  if (schemaString.includes("special")) {
    rules.minSpecialChars = rules.minSpecialChars || 1;
  }

  return rules;
}
