export const testContentType = {
  "name": "AdamTest",
  "enabled": true,
  "type": "Document",
  "presentation": {
      "displayName": "AdamTest",
      "layout": "one-column"
  },
  "fields": [
      {
          "name": "title",
          "type": "String",
          "required": false,
          "multiple": false,
          "presentation": {
              "caption": "Title",
              "hint": "",
              "layoutColumn": 1,
              "displayType": "Simple"
          },
          "validations": {
              "maxLength": null
          },
          "defaultValue": [
              ""
          ]
      }
  ]
}
