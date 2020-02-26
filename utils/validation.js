import "ajv";
import "jsonata";
const validator = new Ajv({ allErrors: true });

const mapFieldErrors = (state, schema, errors) => {
  return (errors || []).reduce((allErrors, error) => {
    const { keyword, dataPath, schemaPath, message } = error;
    const dataJsonPath = dataPath.slice(1);
    const schemaJsonPath = schemaPath
      .replace("#/", "")
      .replace(`/${keyword}`, "")
      .replace(/\//g, ".");
    const property = jsonata(schemaJsonPath).evaluate(schema);
    const errorMessage = `${property.title} ${error.message}`;
    return {
      ...allErrors,
      [dataJsonPath]: errorMessage
    };
  }, {});
};

export const validate = (state, schema, name) => {
  const valid = validator.validate(schema, state);
  const errors = mapFieldErrors(state, schema, validator.errors);
  if (!valid) {
    if (name) {
      // if a name is specified, do field level validation
      return { [name]: errors[name] };
    } else {
      // do form level validation
      return errors;
    }
  }
  return {};
};
