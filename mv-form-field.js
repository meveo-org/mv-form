import { LitElement, html, css } from "lit-element";
import { changeField, changeGroupField } from "./utils/index.js";
import "mv-input";

export class MvFormField extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      label: { type: String },
      value: { type: Object },
      placeholder: { type: String },
      error: { type: String },
      item: { type: Boolean },
      index: { type: Number },
      required: { type: Boolean, attribute: true, reflect: true },
      labelPosition: {
        type: String,
        attribute: "label-position",
        reflect: true
      }
    };
  }

  static get styles() {
    return css`
      .label {
        grid-area: label;
        width: var(--mv-form-field-label-width, 20px);
        white-space: nowrap;
      }
      .label .default-label,
      .label ::slotted(*) {
        font-size: 1em;
        font-weight: bold;
        color: #4e686d;
      }
      .label .required {
        font-style: normal;
        color: #ff0000;
      }
      .field {
        grid-area: field;
        font-size: 1em;
      }
      .error {
        grid-area: error;
        position: relative;
        font-size: 0.8em;
        margin-top: -5px;
        color: #ad4444;
      }
      .field .default-field,
      .field ::slotted(*) {
        font-size: 1.2em;
        width: 100%;
      }
      .mv-form-field {
        display: grid;
        grid-gap: 5px 20px;
        margin: 10px;
        align-items: center;
      }
      .mv-form-field.label-left {
        grid-template-areas:
          "label field field field field"
          ". error error error error";
      }
      .mv-form-field.label-right {
        grid-template-areas:
          "field field field field label"
          "error error error error .";
      }
      .mv-form-field.label-top {
        grid-template-areas:
          "label"
          "field"
          "error";
      }
      .mv-form-field.label-bottom {
        grid-template-areas:
          "field"
          "label"
          "error";
      }
    `;
  }

  constructor() {
    super();
    this.name = "";
    this.label = "";
    this.value = "";
    this.placeholder = "";
    this.error = "";
    this.required = false;
    this.labelPosition = "left";
  }

  render() {
    const value = this.value || "";
    const hasError = !!this.error;
    return html`
      <div class="mv-form-field label-${this.labelPosition}">
        <div class="label">
          <slot name="label">
            <label class="default-label">
              ${this.label}
            </label>
          </slot>
          ${this.required
            ? html`
                <i class="required">*</i>
              `
            : html``}
        </div>
        <div class="field">
          <slot name="field">
            <mv-input
              name="${this.name}"
              type="text"
              .value="${value}"
              placeholder="${this.placeholder}"
              ?has-error="${hasError}"
              @input-change="${this.changeValue}"
            ></mv-input>
          </slot>
        </div>
        ${hasError
          ? html`
              <div class="error">${this.error}</div>
            `
          : html``}
      </div>
    `;
  }

  changeValue = event => {
    if (this.item) {
      changeGroupField(
        event.target,
        { ...event.detail, name: this.name, originalEvent: event },
        this.index
      );
    } else {
      changeField(event.target, {
        ...event.detail,
        name: this.name,
        originalEvent: event
      });
    }
  };
}

customElements.define("mv-form-field", MvFormField);
