import { CapturedImage } from '../types';

/**
 * Configuration for form validation
 */
export interface ValidationConfig<T> {
  /** Minimum number of images required */
  minImages: number;
  /** Base fields that are always required */
  baseFields: (keyof T)[];
  /** Conditional field validations based on specific field values */
  conditionalFields?: ConditionalFieldConfig<T>[];
  /** Fields that require string validation (non-empty after trim) */
  stringFields?: StringFieldConfig<T>[];
  /** Custom validation function for complex logic */
  customValidation?: (report: T) => boolean;
}

/**
 * Configuration for conditional field validation
 */
export interface ConditionalFieldConfig<T> {
  /** The field to check the condition against */
  conditionField: keyof T;
  /** The value that triggers the conditional validation */
  conditionValue: any;
  /** Fields that become required when condition is met */
  requiredFields: (keyof T)[];
}

/**
 * Configuration for string field validation
 */
export interface StringFieldConfig<T> {
  /** The field to check the condition against */
  conditionField: keyof T;
  /** The value that triggers the string validation */
  conditionValue: any;
  /** The string field that must be non-empty when condition is met */
  stringField: keyof T;
  /** Optional: if true, validates when condition value does NOT match */
  negateCondition?: boolean;
}

/**
 * Generic form validation function that can be used across all form components
 * @param report - The report data to validate
 * @param images - Array of captured images
 * @param config - Validation configuration
 * @returns boolean indicating if the form is valid
 */
export function validateForm<T extends Record<string, any>>(
  report: T | null | undefined,
  images: CapturedImage[],
  config: ValidationConfig<T>
): boolean {
  // Check if report exists
  if (!report) return false;

  // Check minimum images requirement
  if (images.length < config.minImages) return false;

  // Helper function to check if fields are valid (not null, undefined, or empty string)
  const checkFields = (fields: (keyof T)[]): boolean => {
    return fields.every(field => {
      const value = report[field];
      return value !== null && value !== undefined && value !== '';
    });
  };

  // Helper function to check if a string field is valid (not empty after trim)
  const checkStringField = (field: keyof T): boolean => {
    const value = report[field];
    return typeof value === 'string' && value.trim() !== '';
  };

  // Validate base fields
  if (!checkFields(config.baseFields)) return false;

  // Validate conditional fields
  if (config.conditionalFields) {
    for (const conditional of config.conditionalFields) {
      if (report[conditional.conditionField] === conditional.conditionValue) {
        if (!checkFields(conditional.requiredFields)) return false;
      }
    }
  }

  // Validate string fields
  if (config.stringFields) {
    for (const stringConfig of config.stringFields) {
      const conditionMet = stringConfig.negateCondition
        ? report[stringConfig.conditionField] !== stringConfig.conditionValue
        : report[stringConfig.conditionField] === stringConfig.conditionValue;

      if (conditionMet) {
        if (!checkStringField(stringConfig.stringField)) return false;
      }
    }
  }

  // Run custom validation if provided
  if (config.customValidation) {
    if (!config.customValidation(report)) return false;
  }

  return true;
}

/**
 * Creates a validation configuration for common form patterns
 */
export class ValidationConfigBuilder<T> {
  private config: ValidationConfig<T>;

  constructor(minImages: number, baseFields: (keyof T)[]) {
    this.config = {
      minImages,
      baseFields,
      conditionalFields: [],
      stringFields: [],
      customValidation: undefined
    };
  }

  /**
   * Add conditional field validation
   */
  addConditionalFields(
    conditionField: keyof T,
    conditionValue: any,
    requiredFields: (keyof T)[]
  ): this {
    if (!this.config.conditionalFields) {
      this.config.conditionalFields = [];
    }
    this.config.conditionalFields.push({
      conditionField,
      conditionValue,
      requiredFields
    });
    return this;
  }

  /**
   * Add string field validation
   */
  addStringField(
    conditionField: keyof T,
    conditionValue: any,
    stringField: keyof T,
    negateCondition: boolean = false
  ): this {
    if (!this.config.stringFields) {
      this.config.stringFields = [];
    }
    this.config.stringFields.push({
      conditionField,
      conditionValue,
      stringField,
      negateCondition
    });
    return this;
  }

  /**
   * Add custom validation function
   */
  addCustomValidation(validationFn: (report: T) => boolean): this {
    this.config.customValidation = validationFn;
    return this;
  }

  /**
   * Build the final configuration
   */
  build(): ValidationConfig<T> {
    return this.config;
  }
}

/**
 * Hook for form validation that returns both validation state and error message
 */
export function useFormValidation<T extends Record<string, any>>(
  report: T | null | undefined,
  images: CapturedImage[],
  config: ValidationConfig<T>
): { isValid: boolean; errorMessage: string | null } {
  const isValid = validateForm(report, images, config);
  
  let errorMessage: string | null = null;
  if (!isValid) {
    if (!report) {
      errorMessage = "Report data is not available.";
    } else if (images.length < config.minImages) {
      errorMessage = `Please capture at least ${config.minImages} photos to submit.`;
    } else {
      errorMessage = "Please fill all required fields to submit.";
    }
  }

  return { isValid, errorMessage };
}
