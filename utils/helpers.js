export const changeField = (element, field) => {
  element.dispatchEvent(
    new CustomEvent("change-field", {
      detail: { ...field },
      bubbles: true,
      composed: true
    })
  );
};

export const changeGroupField = (element, field, index) => {
  element.dispatchEvent(
    new CustomEvent("change-group-field", {
      detail: { ...field, element, index },
      bubbles: true,
      composed: true
    })
  );
};

export const clearForm = confirmFunction => event => {
  const shouldClear = confirmFunction ? confirmFunction() : true;
  if(shouldClear) {
    const {target} = event;
    (target || event).dispatchEvent(
      new CustomEvent("clear-form", { bubbles: true, composed: true })
    );
  }
};

export const submitForm = event => {
  const {target} = event;
  (target || event).dispatchEvent(
    new CustomEvent("submit-form", { bubbles: true, composed: true })
  );
};