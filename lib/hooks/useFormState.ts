/**
 * useFormState - Production-ready form state management with validation
 */

import { useState, useCallback, useRef } from "react";

export interface ValidationError {
  [field: string]: string;
}

export interface UseFormStateOptions<T> {
  initialValues: T;
  validate?: (values: T) => ValidationError;
  onSubmit?: (values: T) => void | Promise<void>;
}

export interface UseFormStateReturn<T> {
  values: T;
  errors: ValidationError;
  touched: { [key in keyof T]?: boolean };
  isSubmitting: boolean;
  isDirty: boolean;

  // Methods
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  setValues: (values: Partial<T>) => void;
  resetForm: () => void;
  setTouched: (field: string, touched: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;

  // Helpers
  getFieldProps: (name: keyof T) => {
    name: keyof T;
    value: T[keyof T];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur: () => void;
    error: string | undefined;
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
  };

  isValid: boolean;
  getError: (field: keyof T) => string | undefined;
}

export function useFormState<T extends Record<string, any>>(
  options: UseFormStateOptions<T>
): UseFormStateReturn<T> {
  const { initialValues, validate, onSubmit } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationError>({});
  const [touched, setTouched] = useState<{ [key in keyof T]?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialValuesRef = useRef(initialValues);

  // Check if form is dirty
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;

  // Set field value
  const setValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[String(field)]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[String(field)];
          return next;
        });
      }
    },
    [errors]
  );

  // Set multiple values
  const setAllValues = useCallback((newValues: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  }, []);

  // Set error
  const setError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  // Clear error
  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValuesRef.current);
    setErrors({});
    setTouched({});
  }, []);

  // Set touched
  const setFieldTouched = useCallback((field: string, isTouched: boolean) => {
    setTouched((prev) => ({ ...prev, [field]: isTouched }));
  }, []);

  // Handle submit
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate
      if (validate) {
        const validationErrors = validate(values);
        setErrors(validationErrors);

        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        );
        setTouched(allTouched);

        if (Object.keys(validationErrors).length > 0) {
          return;
        }
      }

      // Submit
      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } catch (err) {
          // Error handling by caller
          throw err;
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validate, onSubmit]
  );

  // Get error for field
  const getError = useCallback(
    (field: keyof T) => {
      const fieldStr = String(field);
      return touched[field] ? errors[fieldStr] : undefined;
    },
    [errors, touched]
  );

  // Get field props
  const getFieldProps = useCallback(
    (name: keyof T) => {
      const nameStr = String(name);
      const hasError = Boolean(errors[nameStr]);
      const errorMessage = getError(name);

      return {
        name,
        value: values[name],
        onChange: (
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          const value =
            e.target.type === "checkbox"
              ? (e.target as HTMLInputElement).checked
              : e.target.value;
          setValue(name, value as T[typeof name]);
        },
        onBlur: () => setFieldTouched(nameStr, true),
        error: errorMessage,
        "aria-invalid": hasError,
        "aria-describedby": hasError ? `${nameStr}-error` : undefined,
      };
    },
    [values, errors, getError, setValue, setFieldTouched]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    isValid,

    setValue,
    setError,
    clearError,
    setValues: setAllValues,
    resetForm,
    setTouched: setFieldTouched,
    handleSubmit,
    getFieldProps,
    getError,
  };
}
