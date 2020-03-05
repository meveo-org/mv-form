import { html, css } from "lit-element";
import { MvElement } from "mv-element";
import {
  changeField,
  changeGroupField,
  submitForm,
  clearForm,
  matchError
} from "./utils/index.js";
import "mv-container";
import "mv-input";
import "./mv-form.js";
import "./mv-form-field.js";
import "./mv-form-group.js";

import schema from "./model/DemoForm.json";

const EMPTY_LOCATION = {
  streetAddress: "",
  city: "",
  state: "",
  country: ""
};

export class MvFormDemo extends MvElement {
  static get properties() {
    return {
      firstName: { type: String, attribute: false },
      lastName: { type: String, attribute: false },
      locations: { type: Array, attribute: false },
      remarks: { type: String, attribute: false },
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

      mv-container.location {
        --mv-container-min-width: 560px;
        --mv-container-max-width: 620px;
        --mv-container-margin: 0;
        --mv-container-padding: 20px 30px;
      }

      textarea {
        width: 80%;
        min-height: 50px;
        border: 1px solid black;
        margin: 0;
        padding: 5px;
        border-radius: 5px;
        resize: none;
      }

      button,
      label {
        font-size: 1em;
        font-weight: bold;
        color: #4e686d;
      }

      label .required {
        font-style: normal;
        color: #ff0000;
      }

      fieldset {
        margin: 10px auto;
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
        { property: "remarks", value: "remarks" }
      ]
    };
  }

  render() {
    return html`
      <mv-container>
        <mv-form .store="${this.store}" .schema="${schema}">
          <mv-form-field
            name="firstName"
            label="First name"
            placeholder="Enter first name here..."
            .value="${this.firstName}"
            .error="${matchError(this.errors, "firstName")}"
            required
          ></mv-form-field>
          <mv-form-field
            name="lastName"
            label="Last name"
            placeholder="Enter last name here..."
            .value="${this.lastName}"
            .error="${matchError(this.errors, "lastName")}"
            required
          ></mv-form-field>
          <mv-form-group
            name="locations"
            .values="${this.locations}"
            .error="${matchError(this.errors, "locations")}"
          >
            <label>Locations <i class="required">*</i></label>
            ${(this.locations || []).map(
              (address, index) => html`
                <fieldset>
                  <legend>
                    <label>
                      <button @click="${this.removeLocation(index)}">
                        &#x2716; delete
                      </button>
                      ( ${index + 1} )
                    </label>
                  </legend>
                  <mv-form-field
                    label="Street address"
                    .error="${matchError(
                      this.errors,
                      "streetAddress",
                      "locations",
                      index
                    )}"
                    required
                  >
                    <textarea
                      name="streetAddress"
                      slot="field"
                      placeholder="Enter street address here..."
                      .value="${address.streetAddress}"
                      @change="${this.changeStreetAddress(index)}"
                    ></textarea>
                  </mv-form-field>
                  <mv-form-field
                    item
                    name="city"
                    label="City"
                    placeholder="Enter city..."
                    .value="${address.city}"
                    .index="${index}"
                    .error="${matchError(
                      this.errors,
                      "city",
                      "locations",
                      index
                    )}"
                    required
                  ></mv-form-field>
                  <mv-form-field
                    item
                    name="state"
                    label="State"
                    placeholder="Enter state..."
                    .value="${address.state}"
                    .index="${index}"
                    .error="${matchError(
                      this.errors,
                      "state",
                      "locations",
                      index
                    )}"
                  ></mv-form-field>
                  <mv-form-field
                    item
                    name="country"
                    label="Country"
                    placeholder="Enter country..."
                    .value="${address.country}"
                    .index="${index}"
                    .error="${matchError(
                      this.errors,
                      "country",
                      "locations",
                      index
                    )}"
                    required
                  ></mv-form-field>
                </fieldset>
              `
            )}
            <button @click="${this.addLocation}">&#x271A; add</button>
          </mv-form-group>
          <mv-form-field
            custom
            .error="${matchError(this.errors, "remarks")}"
            label-position="top"
            required
          >
            <label slot="label">Remarks</label>
            <textarea
              name="remarks"
              slot="field"
              placeholder="Enter remarks here..."
              .value="${this.remarks}"
              @change="${this.changeRemarks}"
            ></textarea>
          </mv-form-field>
          <div class="footer-buttons">
            <button @click="${clearForm(this.confirmClearForm)}">Clear</button>
            <button @click="${submitForm}">Submit</button>
          </div>
        </mv-form>
      </mv-container>
    `;
  }

  connectedCallback() {
    this.addEventListener("update-errors", this.handleErrors);
    this.addEventListener("validation-success", this.handleSubmit);
    this.addEventListener("clear-errors", this.clearErrors);
    super.connectedCallback();
  }

  changeStreetAddress = index => event => {
    const { target } = event;
    const { name, value } = target;
    changeGroupField(target, { name, value, originalEvent: event }, index);
  };

  changeRemarks = event => {
    const { target } = event;
    const { name, value } = target;
    changeField(target, { name, value, originalEvent: event });
  };

  addLocation = event => {
    const value = [...this.locations, { ...EMPTY_LOCATION }];
    changeField(event.target, {
      name: "locations",
      originalEvent: event,
      value
    });
  };

  removeLocation = index => event => {
    const value = [
      ...[...this.locations.slice(0, index)],
      ...[...this.locations.slice(index + 1)]
    ];
    changeField(event.target, {
      name: "locations",
      validateGroup: true,
      originalEvent: event,
      value
    });
  };

  confirmClearForm = () => {
    return confirm("Are you sure you want to clear the form? ");
  };

  clearErrors = () => {
    this.errors = null;
  };

  handleErrors = event => {
    const {
      detail: { errors }
    } = event;
    this.errors = errors;
  };

  handleSubmit = event => {
    const {
      detail: { formValues }
    } = event;
    alert("Form submit OK: " + JSON.stringify(formValues, null, 2));
  };
}

customElements.define("mv-form-demo", MvFormDemo);
