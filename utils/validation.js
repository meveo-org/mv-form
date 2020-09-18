import "ajv";
import "jsonata";

const DEFAULT_CONFIG = {
  allErrors: true,
  format: "full",
  missingRefs: true,
  loopRequired: "Infinite",
  verbose: true,
  extendRefs: true,
  schemaId: "auto",
  useDefaults: "empty",
};

const mapFieldErrors = (name, schema, errors, refSchemas) => {
  return (errors || []).reduce((allErrors, error) => {
    const { keyword, dataPath, schemaPath, message, parentSchema } = error;
    const dataJsonPath = dataPath.slice(1);
    const schemaJsonPath = schemaPath
      .replace("#/", "")
      .replace(`/${keyword}`, "")
      .replace(/\//g, ".");
    const dotIndex = schemaJsonPath.indexOf(".");
    const schemaSuffix = dotIndex > -1 ? "." : "";
    const validationSchema =
      [schema, ...(refSchemas || [])].find((currentSchema) => {
        const schemaName = `${currentSchema.id}${schemaSuffix}`;
        return (
          schemaJsonPath.startsWith(schemaName) ||
          parentSchema.title.startsWith(schemaName)
        );
      }) || schema;
    const usesRefSchema =
      !schemaJsonPath.startsWith("properties.") &&
      !!validationSchema.id &&
      schema.id !== validationSchema.id;
    const searchPath = usesRefSchema
      ? schemaJsonPath.substring(dotIndex + 1)
      : schemaJsonPath;
    const property = jsonata(searchPath).evaluate(validationSchema) || {};
    const errorMessage = `${property.title || name} ${message}`;
    return {
      ...allErrors,
      [dataJsonPath]: errorMessage,
    };
  }, {});
};

export const validate = (schema, state, name, validateGroup, refSchemas) => {
  const validator = new Ajv(DEFAULT_CONFIG);
  if (!!refSchemas && refSchemas.length > 0) {
    refSchemas.forEach((refSchema) => {
      validator.addSchema(refSchema);
    });
  }
  const valid = validator.validate(schema, state);
  const errors = mapFieldErrors(name, schema, validator.errors, refSchemas);
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
