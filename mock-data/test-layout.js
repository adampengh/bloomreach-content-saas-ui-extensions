export const testLayout = {
  "name": "one-column-test",
  "label": "One-Column Layout Test",
  "description": null,
  "parameters": {},
  "type": "xpage",
  "extends": "base",
  "components": [
      {
          "name": "top",
          "label": null,
          "description": null,
          "parameters": {},
          "xtype": null,
          "definition": null,
          "components": [
              {
                  "name": "container",
                  "label": "Top",
                  "description": null,
                  "parameters": {},
                  "xtype": "hst.nomarkup",
                  "type": "managed"
              }
          ],
          "type": "static"
      },
      {
          "name": "main",
          "label": null,
          "description": null,
          "parameters": {},
          "xtype": null,
          "definition": null,
          "components": [
              {
                  "name": "container",
                  "label": "Main",
                  "description": null,
                  "parameters": {},
                  "xtype": "hst.nomarkup",
                  "type": "managed"
              }
          ],
          "type": "static"
      },
      {
          "name": "bottom",
          "label": null,
          "description": null,
          "parameters": {},
          "xtype": null,
          "definition": null,
          "components": [
              {
                  "name": "container",
                  "label": "Bottom",
                  "description": null,
                  "parameters": {},
                  "xtype": "hst.nomarkup",
                  "type": "managed"
              }
          ],
          "type": "static"
      }
  ]
}
