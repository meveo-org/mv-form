import { LitElement, html, css } from "lit-element";
import { validate } from "./utils/index.js";

const mapValue = (formValues, name, value) => {
  const propertyIndex = (name || "").indexOf(".");
  if (propertyIndex > -1) {
    const parentName = name.substring(0, propertyIndex);
    const propertyValue = mapValue(
      formValues[parentName],
      name.substring(propertyIndex + 1),
      value
    );
    return { [parentName]: propertyValue };
  }
  return { [name]: value };
};

export class MvForm extends LitElement {
  static get properties() {
    return {
      store: { type: Object, attribute: false, reflect: true },
      schema: { type: Object, attribute: false, reflect: true },
      formValues: { type: Object, attribute: false, reflect: true },
      refSchemas: { type: Array, attribute: false, reflect: true },
      storageModes: { type: String, attribute: "storage-modes", reflect: true },
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family, Arial);
        font-size: var(--font-size-m, 1em);
      }

      .mv-form {
        display: grid;
        grid-gap: var(--mv-form-grid-gap, 5px 10px);
        grid-template-columns: var(--mv-form-grid-columns, auto);
        grid-template-rows: var(--mv-form-grid-rows, auto);
      }
    `;
  }

  constructor() {
    super();
    this.store = null;
    this.schema = null;
    this.formValues = {};
  }

  render() {
    return html`
      <div class="mv-form">
        <slot></slot>
      </div>
    `;
  }

  connectedCallback() {
    this.addEventListener("change-field", this.changeField);
    this.addEventListener("submit-form", this.submitForm);
    this.addEventListener("clear-form", this.clearForm);
    super.connectedCallback();
  }

  changeField = (event) => {
    const usesStore = !!this.store;
    const {
      detail: { name, value, group, index, validateGroup },
    } = event;
    let fieldError = null;
    const fieldName = group || name;
    const groupName = validateGroup ? group : `${group}[${index}].${name}`;
    const errorKey = !!group ? groupName : name;
    const values = usesStore ? this.store.state : this.formValues;
    if (usesStore) {
      this.store.updateValue(fieldName, value);
    } else {
      const formValue = mapValue(this.formValues, fieldName, value);
      this.formValues = { ...this.formValues, ...formValue };
      this.dispatchEvent(
        new CustomEvent("update-form", {
          detail: { values: this.formValues },
          bubbles: true,
          composed: true,
        })
      );
    }

    fieldError = validate(
      this.schema,
      values,
      errorKey,
      validateGroup,
      this.refSchemas
    );

    if (fieldError) {
      const errorsFound = validateGroup
        ? fieldError
        : { [errorKey]: fieldError };
      if (validateGroup) {
        this.errors = {
          ...Object.keys(this.errors || {}).reduce(
            (remainingErrors, key) =>
              key.startsWith(name)
                ? remainingErrors
                : { ...remainingErrors, [key]: this.errors[key] },
            {}
          ),
          ...errorsFound,
        };
      } else {
        this.errors = { ...this.errors, ...errorsFound };
      }
      this.dispatchEvent(
        new CustomEvent("update-errors", {
          detail: {
            errors: { ...this.errors },
          },
          bubbles: true,
          composed: true,
        })
      );
    } else {
      const errorExists = Object.keys(this.errors || {}).some(
        (key) => key === errorKey
      );
      if (errorExists) {
        // remove the existing error
        delete this.errors[errorKey];
        this.dispatchEvent(
          new CustomEvent("update-errors", {
            detail: {
              errors: { ...this.errors },
            },
            bubbles: true,
            composed: true,
          })
        );
      }
    }
  };

  submitForm = () => {
    const usesStore = !!this.store;
    if (usesStore) {
      const { state } = this.store;
      this.errors = validate(this.schema, state, null, null, this.refSchemas);
    } else {
      this.errors = validate(
        this.schema,
        this.formValues,
        null,
        null,
        this.refSchemas
      );
    }
    if (this.errors) {
      this.dispatchEvent(
        new CustomEvent("update-errors", {
          detail: {
            errors: this.errors,
          },
          bubbles: true,
          composed: true,
        })
      );
    } else {
      this.dispatchEvent(
        new CustomEvent("validation-success", {
          detail: {
            formValues: usesStore ? this.store.state : this.formValues,
          },
          bubbles: true,
          composed: true,
        })
      );
    }
  };

  clearForm = () => {
    if (this.store) {
      this.store.resetState(true);
    } else {
      this.formValues = {};
      this.dispatchEvent(
        new CustomEvent("update-form", {
          detail: { values: this.formValues },
          bubbles: true,
          composed: true,
        })
      );
    }
    this.dispatchEvent(
      new CustomEvent("clear-errors", { bubbles: true, composed: true })
    );
  };
}

customElements.define("mv-form", MvForm);
