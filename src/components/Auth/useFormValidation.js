import React, { useEffect } from "react";

function useFormValidation(initialState, validate, authenticate) {
  const [values, setValues] = React.useState(initialState);
  const [errors, setErrors] = React.useState({});
  const [isSubmmitting, setSubmitting] = React.useState(false);

  useEffect(() => {
    if (isSubmmitting) {
      const noErrors = Object.keys(errors).length === 0;
      if (noErrors) {
        console.log("Authenticated", values);
        authenticate();
        setSubmitting(false);
      } else {
        setSubmitting(false);
      }
    }
  }, [errors]);

  function handleChange(event) {
    event.persist();
    setValues((previousValues) => ({
      ...previousValues,
      [event.target.name]: event.target.value,
    }));
  }

  function handleBlur() {
    const validationErrors = validate(values);
    setErrors(validationErrors);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setSubmitting(true);
    console.log({ values });
  }

  return {
    handleChange,
    handleSubmit,
    values,
    handleBlur,
    errors,
    isSubmmitting,
  };
}

export default useFormValidation;
