export default {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["firstName", "lastName", "locations"],
  "properties": {
    "firstName": {
      "type": "string",
      "minLength": 1,
      "title": "First name"
    },
    "lastName": {
      "type": "string",
      "minLength": 1,
      "title": "Last name"
    },
    "locations": {
      "type": "array",
      "title": "Locations",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["streetAddress", "city", "country"],
        "properties": {
          "streetAddress": {
            "type": "string",
            "minLength": 1,
            "title": "Street name"
          },
          "city": {
            "type": "string",
            "minLength": 1,
            "title": "City"
          },
          "country": {
            "type": "string",
            "minLength": 1,
            "title": "Country"
          },
          "state": {
            "type": "string",
            "title": "State"
          }
        }
      }
    },
    "remarks": {
      "type": "string",
      "minLength": 1,
      "title": "Remarks"
    },
    "inlineField1": {
      "type": "string",
      "minLength": 1,
      "title": "Inline Field 1"
    },
    "inlineField2": {
      "type": "string",
      "minLength": 1,
      "title": "Inline Field 2"
    }
  }
}
