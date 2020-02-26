import { LitElement, html, css } from "lit-element";

export class MvFormField extends LitElement {
  static get properties() {
    return {
      name: {type: String},
      label: {type: String},
      value: {type: Object}
    };
  }

  static get styles() {
    return css``;
  }

  constructor() {
    super();
  }

  render() {
    const value = this.value || "";
    return html`
      <div class="mv-form-field">
        <div class="label" @click="${this.clickLabel}">
          <slot name="label">
            <label>${this.label}</label>
          </slot>
        </div>
        <div class="field">
          <slot>
            <input value="${value}" />
          </slot>
        </div>
      </div>      
    `;
  }

  clickLabel = () => {}

}

customElements.define("mv-form-field", MvFormField);
