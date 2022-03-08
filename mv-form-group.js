import { LitElement, html, css } from "lit";
import { changeField } from "./utils/index.js";

export class MvFormGroup extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      values: { type: Object },
      error: { type: String }
    };
  }

  static get styles() {
    return css`
      .form-group {
        grid-area: group;
      }

      .error {
        grid-area: error;
        position: relative;
        font-size: 0.8em;
        color: #ad4444;
      }

      .mv-form-group {
        display: grid;
        grid-gap: 10px;
        grid-template-columns: auto;
        grid-template-rows: auto;
        grid-template-areas:
          "group";
      }

      .has-error {
        grid-template-areas:
          "group"
          "error";
      }
    `;
  }

  render() {
    const errorClass = this.error ? " has-error" : "";
    return html`
      <div class="mv-form-group${errorClass}">
        <div class="form-group">
          <slot></slot>
        </div>
        ${this.error
          ? html`
              <div class="error">${this.error}</div>
            `
          : html``}
      </div>
    `;
  }

  connectedCallback() {
    this.addEventListener("change-group-field", this.changeGroupField);
    super.connectedCallback();
  }

  changeGroupField = event => {
    const { detail } = event;
    const { name, value, index, element } = detail;
    const currentValue = this.values[index];
    const values = [
      ...this.values.slice(0, index),
      { ...currentValue, [name]: value },
      ...this.values.slice(index + 1)
    ];
    changeField(element, { name, value: values, group: this.name, index });
  };
}

customElements.define("mv-form-group", MvFormGroup);
