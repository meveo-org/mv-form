export const changeField = (element, field) => {
  element.dispatchEvent(
    new CustomEvent("change-field", { detail: { ...field }, bubbles: true, composed: true })
  );
};
