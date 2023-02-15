const sampleJson = {
    "name": "banner",
    "enabled": true,
    "type": "Document",
    "presentation": {
        "displayName": "Banner",
        "layout": "two-column"
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
        },
        {
            "name": "content",
            "type": "RichText",
            "required": false,
            "multiple": false,
            "presentation": {
                "caption": "Content",
                "hint": "",
                "layoutColumn": 1,
                "ckEditorAppendedJson": null,
                "ckEditorOverlayedJson": null,
                "imagepickerBasePath": null,
                "imagepickerType": "images",
                "imagepickerNodetypes": null,
                "imagepickerLastVisitedEnabled": null,
                "imagepickerLastVisitedGroupKey": "ckeditor-imagepicker",
                "imagepickerLastVisitedNodetypes": [
                    "gallery"
                ],
                "imagepickerPreferredImageVariant": "original",
                "linkpickerBasePath": null,
                "linkpickerType": "documents",
                "linkpickerNodetypes": null,
                "linkpickerLastVisitedEnabled": null,
                "linkpickerLastVisitedGroupKey": "ckeditor-linkpicker",
                "linkpickerLastVisitedNodetypes": [
                    "folder"
                ],
                "linkPickerLanguageContextAware": null,
                "linkPickerOpenInNewWindowEnabled": true,
                "includeImageVariants": null,
                "excludeImageVariants": null
            },
            "validations": {},
            "defaultValue": [
                ""
            ]
        },
        {
            "name": "image",
            "type": "Link",
            "required": false,
            "multiple": false,
            "presentation": {
                "caption": "Image",
                "hint": "",
                "layoutColumn": 1,
                "uploadEnabled": true,
                "displayType": "ImageLink",
                "lookupFolderTypes": null,
                "lastVisitedKey": "gallerypicker-imagelink",
                "lastVisitedEnabled": true
            },
            "validations": {},
            "defaultValue": [
                "/"
            ]
        },
        {
            "name": "cta",
            "type": "String",
            "required": false,
            "multiple": false,
            "presentation": {
                "caption": "CTA",
                "hint": "",
                "layoutColumn": 2,
                "displayType": "Simple"
            },
            "validations": {
                "maxLength": null
            },
            "defaultValue": [
                ""
            ]
        },
        {
            "name": "link",
            "type": "Link",
            "required": false,
            "multiple": false,
            "presentation": {
                "caption": "Link",
                "hint": "",
                "layoutColumn": 2,
                "lookupFolderPath": null,
                "lastVisitedNodetypes": null,
                "languageContextAware": true,
                "pickerType": null,
                "displayType": "AnyLink",
                "lookupFolderTypes": null,
                "lastVisitedKey": null,
                "lastVisitedEnabled": true
            },
            "validations": {},
            "defaultValue": [
                "/"
            ]
        }
    ],
    "system": {
        "createdBy": "admin",
        "createdAt": "2020-10-01T17:00:00+01:00",
        "updatedBy": "admin",
        "updatedAt": "2020-10-01T17:00:00+01:00"
    }
}

export default sampleJson
