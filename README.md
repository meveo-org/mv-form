# mv-form

MvForm is a Meveo form component (based on lit-element) that provides functionality to create, validate, and submit forms.

## Features
* includes field(`mv-form-field`) and field group (`mv-form-group`) components
* includes validation using [ajv](https://github.com/epoberezkin/ajv)
* includes helper functions for field values and errors

## Dependencies
* mv-input
* mv-dependencies

## Quick Start

To experiment with the MvForm component.

1. Clone this repo.

2. Serve the project from the root directory with some http server (best served with meveo itself)

3. Update the form demo component in demo.js file

## Sample usage

### Form with single input field

```html
  <mv-form
  .store="${this.store}"
  .schema="${schema}"
  .refSchemas="${[refSchema1, refSchema2, ...]}" // optional list of schemas referred to in the schema
  >
    <mv-form-field
      name="firstName"
      label="First name"
      placeholder="Enter first name here..."
      label-position="top"                    // valid values are top, bottom, left, right, or none;
      .value="${this.firstName}"
      .error="${FormUtils.matchError(this.errors, "firstName")}"
      required                                // enable to make field required
      disabled                                // indicates field is disabled
      immediate                               // trigger input value change on key press
    ></mv-form-field>
    <button @click="${FormUtils.submitForm}">Submit</button>
  <mv-form>
```

### Form with form group

```html
  <mv-form .store="${this.store}" .schema="${schema}">
    <mv-form-group
      name="locations"
      .values="${this.locations}"
      .error="${FormUtils.matchError(this.errors, "locations")}"
    >
      <label>Locations <i class="required">*</i></label>
      ${(this.locations || []).map(
        (location, index) => html`
          <mv-form-field
            item
            name="address"
            label="Address"
            placeholder="Enter address..."
            .value="${location.address}"
            .index="${index}"
            .error="${FormUtils.matchError(
              this.errors,
              "address",
              "locations",
              index
            )}"
            required
          ></mv-form-field>
        `
      )}
    </mv-form-group>    
    <button @click="${FormUtils.clearForm}">Clear</button>
    <button @click="${FormUtils.submitForm}">Submit</button>
  </mv-form>
```

### Form with custom field
```html
  <mv-form .store="${this.store}" .schema="${schema}">
    <mv-form-field
      .error="${FormUtils.matchError(this.errors, "remarks")}"
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
    <button @click="${FormUtils.submitForm}">Submit</button>
  <mv-form>
```

**Note:**  Check the `demo.js` code for more implementation sample details.

## Helper functions
The helper functions encapsulates common functionality that is used by `MvForm` to dispatch form actions and to validate form data. The main index for the helper functions can be found in `mv-form/utils/index.js`.  They can be imported either directly or using import maps.

### Functions
* **changeField** - used to dispatch an action to update a field's value on the form.  Normally, `mv-form-field` uses this function, but in case there is a need to declare custom field components, this function can be used directly.  By default, it also will trigger validation for the field and will dispatch an `update-errors` event when the field value fails validation.
* **changeGroupField** - used to dispatch an action to update a field inside of a field group.  This is used by `mv-form-field` if the `item` attribute is declared (i.e. `<mv-form-field item></mv-form-field>`) inside a `mv-form-group` component.  As with `changeField`, it also can be used directly when declaring custom field components.
* **clearForm** - this is used to clear all the fields and errors from a form.  By default it will not prompt a user for confirmation.  So if a confirmation prompt is desired, pass in the confirmation function that should return a boolean response to whether or not the form should be cleared.
* **submitForm** - this is used to trigger a submit action for the form.  By default, it will validate the form against the declared form `schema`.
* **matchError** - this is used to retrieve the specific error message for a field.  When retrieving the error for a regular form field, just pass in the `errors` object and the `name` of the field.  If the field is part of a group, also include the `group` name and the array `index` of the group.  ***Note:***  The error message meant for the whole group can also be retrieved by passing in the `error` object and the `group` name.

## Custom events
`mv-form` dispatches the following custom events:

* **update-errors** - this contains an `errors` object in the event detail.  This is dispatched if a validation error is encountered when a form field or field group changes or when the form is submitted.
* **clear-errors** - this is dispatched when clearing the form.
* **update-form** - this is dispatched when field or field group is updated or when the form is cleared.  Normally, this event is not used if the form is used with an `MvElement` component since the form contents are then managed by `MvStore` directly.
* **validation-success** - this is dispatched if the form is submitted and validation succeeds.

## Demo
You can also check this [demo](https://form.meveo.org/)

## Acknowledgement

* uses [ajv](https://github.com/epoberezkin/ajv) for validation
* follows [JSON Schema Draft 7](https://json-schema.org/specification-links.html#draft-7) for validation
* makes use of [jsonata](https://jsonata.org/) for parsing and fetching json values from schema and validation errors object