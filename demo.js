import { html, css } from "lit-element";
import { MvElement } from "mv-element";
import { changeField } from "./utils/index.js";
import "mv-container";
import "mv-input";
import "./mv-form-field.js";
import "./mv-form.js";

export class MvFormDemo extends MvElement {
  static get properties() {
    return {
      firstName: { type: String, attribute: false },
      lastName: { type: String, attribute: false },
      locations: { type: Array, attribute: false },
      tags: { type: Array, attribute: false },
      errors: { type: Object, attribute: false }
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family, Arial);
        font-size: var(--font-size-m, 10pt);
      }

      mv-container {
        --mv-container-min-width: 620px;
        --mv-container-max-width: 620px;
        --mv-container-margin: 50px auto;
        --mv-container-padding: 20px 30px;
      }
    `;
  }

  static get model() {
    return {
      modelClass: "DemoForm",
      mappings: [
        { property: "firstName", value: "firstName" },
        { property: "lastName", value: "lastName" },
        { property: "locations", value: "locations" },
        { property: "tags", value: "tags" },
        { property: "remarks", value: "remarks" }
      ]
    };
  }

  render() {
    return html`
      <mv-container>
        <mv-form .store="${this.store}">
          <mv-form-field
            name="firstName"
            label="First name"
            label-position="left"
            placeholder="Enter first name here..."
            .value="${this.firstName}"
          ></mv-form-field>
          <mv-form-field label-position="left">
            <label slot="label"><b>Label</b></label>
            <textarea
              slot="field"
              placeholder="Enter remarks here..."
              name="remarks"
              @change="${this.changeRemarks}"
            ></textarea>
          </mv-form-field>
        </mv-form>
      </mv-container>
    `;
  }

  formSubmit = event => {
    const {
      detail: { originalEvent }
    } = event;
    console.log("originalEvent", originalEvent);
  };

  changeRemarks = event => {
    const {
      target: { value, name }
    } = event;
    changeField(event.target, { name, value, originalEvent: event });
  };
}

customElements.define("mv-form-demo", MvFormDemo);
