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
