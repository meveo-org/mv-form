import "ajv";
import "jsonata";
const validator = new Ajv({ allErrors: true, useDefaults: "empty" });

const mapFieldErrors = (schema, errors) => {
  return (errors || []).reduce((allErrors, error) => {
    const { keyword, dataPath, schemaPath, message } = error;
    const dataJsonPath = dataPath.slice(1);
    const schemaJsonPath = schemaPath
      .replace("#/", "")
      .replace(`/${keyword}`, "")
      .replace(/\//g, ".");
    const property = jsonata(schemaJsonPath).evaluate(schema);
    const errorMessage = `${property.title} ${message}`;
    return {
      ...allErrors,
      [dataJsonPath]: errorMessage,
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
