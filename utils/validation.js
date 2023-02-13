import jsonata from "jsonata";
import Ajv from "ajv";

const validator = new Ajv({ allErrors: true, useDefaults: "empty" });

const mapErrorMessage= (error) => {
  const { 
    message,
    params: {
      missingProperty,
    } 
  } = error;

  if (missingProperty) {
    return "Field required";
  }

  return message;
}

const mapErrorKey = (error) => {
  const { 
    dataPath,
    params: {
      missingProperty,
    } 
  } = error;

  return dataPath.slice(1) || missingProperty;
}

const mapFieldErrors = (schema, errors) => {
  return (errors || []).reduce((allErrors, error) => {
    const errorKey = mapErrorKey(error);
    const errorMessage = mapErrorMessage(error);
    return {
      ...allErrors,
      [errorKey]: errorMessage,
    };
  }, {});
};

export const validate = (schema, state, name, validateGroup) => {
  const valid = validator.validate(schema, state);
  const errors = mapFieldErrors(schema, validator.errors);
  if (!valid) {
    if (validateGroup) {
      // fetch all errors for the group
      return Object.keys(errors || {}).reduce(
        (groupErrors, key) =>
          key.startsWith(name)
            ? { ...groupErrors, [key]: errors[key] }
            : groupErrors,
        {}
      );
    } else if (name) {
      // if a name is specified, do field level validation
      return errors[name];
    } else {
      // do form level validation
      return errors;
    }
  }
  return null;
};

export const matchError = (errors, name, group, index) => {
  if (errors) {
    if (group) {
      const groupField = !!name ? `.${name}` : "";
      return errors[`${group}[${index}]${groupField}`];
    }
    return errors[name];
  }
  return null;
};
