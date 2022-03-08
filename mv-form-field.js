import { LitElement, html, css } from "lit";
import { changeField, changeGroupField } from "./utils/index.js";
import "@meveo-org/mv-input";

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
      disabled: { type: Boolean, attribute: true, reflect: true },
      immediate: { type: Boolean, attribute: true, reflect: true },
      labelPosition: {
        type: String,
        attribute: "label-position",
        reflect: true
      }
    };
  }

  static get styles() {
    return css`
      :host {
        --mv-form-font-family: var(--font-family, Arial);
        --mv-form-font-size: var(--font-size-m, 1em);
      }

      .label {
        grid-area: label;
      }

      .label .default-label,
      .label ::slotted(*) {
        font-size: var(--mv-form-font-size);
        font-weight: bold;
        color: #4e686d;
      }

      .label .required {
        font-style: normal;
        color: #ff0000;
      }

      .field {
        grid-area: field;
        font-size: var(--mv-form-font-size);
      }

      .error {
        grid-area: error;
        position: relative;
        font-size: calc(var(--mv-form-font-size) * 0.8);
        color: #ad4444;
      }

      .field .default-field,
      .field ::slotted(*) {
        width: 100%;
      }

      .field .default-field,
      .field ::slotted(*),
      .field .default-field::placeholder,
      .field ::slotted(*)::placeholder {
        font-family: var(--mv-form-font-family);
        font-size: var(--mv-form-font-size);
      }

      .field .default-field::placeholder,
      .field ::slotted(*)::placeholder {
        font-weight: 100;
      }

      .mv-form-field {
        display: grid;
        grid-column-gap: 20px;
        grid-row-gap: 5px;
        margin-bottom: 10px;
        align-items: center;
      }

      .mv-form-field.label-left {
        grid-template-columns: 20% auto;
        grid-template-rows: auto;
        grid-template-areas:
          "label field"
          ". error";
      }

      .mv-form-field.label-right {
        grid-template-columns: auto 20%;
        grid-template-rows: auto;
        grid-template-areas:
          "field label"
          "error .";
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

      .mv-form-field.label-none {
        grid-template-areas:
          "field"
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
    this.disabled = false;
    this.immediate = false;
    this.labelPosition = "left";
  }

  render() {
    const value = this.value || "";
    const hasError = !!this.error;
    const noLabel = this.labelPosition === "none";
    return html`
      <div class="mv-form-field label-${this.labelPosition}">
        ${noLabel
          ? html``
          : html`
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
            `}

        <div class="field">
          <slot name="field">
            <mv-input
              name="${this.name}"
              type="text"
              .value="${value}"
              placeholder="${this.placeholder}"
              ?has-error="${hasError}"
              @input-change="${this.changeValue}"
              ?disabled="${this.disabled}"
              ?required="${this.required}"
              ?immediate="${this.immediate}"
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
