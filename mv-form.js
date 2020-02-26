import { LitElement, html, css } from "lit-element";

export class MvForm extends LitElement {
  static get properties() {
    return {
      store: { type: Object, attribute: false, reflect: true }
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family, Arial);
        font-size: var(--font-size-m, 1em);
      }
    `;
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
    super.connectedCallback();
  }

  changeField = event => {
    const {
      detail: { name, value }
    } = event;
    if (this.store) {
      this.store.updateValue(name, value);
    }
  };

  submitForm = event => {};

  validateForm = form => {
    console.log("validateForm");
  };
}

customElements.define("mv-form", MvForm);
