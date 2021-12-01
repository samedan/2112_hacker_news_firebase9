export default function validateCreateLink(values) {
  let errors = {};

  // Description errors
  if (!values.description) {
    errors.description = "Description required";
  } else if (
    values.description.length < 10 ||
    values.description.length > 500
  ) {
    errors.description = "Description must be between 10 and 500 characters";
  }

  // URL errors
  if (!values.url) {
    errors.url = "URL required";
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
    errors.url = "URL must be valid";
  }

  return errors;
}
