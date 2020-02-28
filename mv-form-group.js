import { LitElement, html, css } from "lit-element";
import { changeField } from "./utils/index.js";

export class MvFormGroup extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      values: { type: Object }
    };
  }

  static get styles() {
    return css``;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="mv-form-group">
        <div class="form-group">
          <slot></slot>
        </div>
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
    changeField(element, { name: this.name, value: values });
  };
}

customElements.define("mv-form-group", MvFormGroup);
