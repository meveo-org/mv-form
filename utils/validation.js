import jsonata from "jsonata";
import Ajv from "ajv";
import localize from "ajv-i18n";

const validator = new Ajv({ allErrors: true, useDefaults: "empty", messages: true });

const mapErrorMessage= (error, locale = "en") => {
  const { 
    message,
    params: {
      missingProperty,
    } 
  } = error;

  if (missingProperty) {
    if (locale === "fr") {
      return "Champs requis";
    }
    return "Field required";
  }

  return message;
}

const mapErrorKey = (error) => {
  const { 
    dataPath,
    instancePath,
    params: {
      missingProperty,
    } 
  } = error;

  return dataPath?.slice(1) || missingProperty || instancePath.substr(1);
}

const mapFieldErrors = (schema, errors, locale = "en") => {
  return (errors || []).reduce((allErrors, error) => {
    const errorKey = mapErrorKey(error);
    const errorMessage = mapErrorMessage(error, locale);
    return {
      ...allErrors,
      [errorKey]: errorMessage,
    };
  }, {});
};

export const validate = (schema, state, name, validateGroup, locale = "en") => {
  const valid = validator.validate(schema, state);
  console.trace(locale)
  localize[locale](validator.errors);

  const errors = mapFieldErrors(schema, validator.errors, locale);
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
