import { useState, useCallback } from "react";

export function useFormValidation(initialValues = {}, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));

      // Limpar erro quando o usuário começa a digitar
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const validateField = useCallback(
    (name, value) => {
      const rules = validationRules[name];
      if (!rules) return "";

      for (const rule of rules) {
        if (rule.required && !value?.trim()) {
          return rule.message || `${name} é obrigatório`;
        }

        if (rule.minLength && value?.length < rule.minLength) {
          return (
            rule.message ||
            `${name} deve ter pelo menos ${rule.minLength} caracteres`
          );
        }

        if (rule.maxLength && value?.length > rule.maxLength) {
          return (
            rule.message ||
            `${name} deve ter no máximo ${rule.maxLength} caracteres`
          );
        }

        if (rule.pattern && !rule.pattern.test(value)) {
          return rule.message || `${name} é inválido`;
        }

        if (rule.custom && !rule.custom(value)) {
          return rule.message || `${name} é inválido`;
        }
      }

      return "";
    },
    [validationRules]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules, validateField]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues,
    setErrors,
  };
}
