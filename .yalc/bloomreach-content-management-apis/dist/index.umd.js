(function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("axios")) : typeof define === "function" && define.amd ? define([ "exports", "axios" ], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, 
    factory(global.BloomreachSpaSdk = {}, global.axios));
})(this, (function(exports, axios) {
    "use strict";
    function _interopDefaultLegacy(e) {
        return e && typeof e === "object" && "default" in e ? e : {
            default: e
        };
    }
    var axios__default = _interopDefaultLegacy(axios);
    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P ? value : new P((function(resolve) {
                resolve(value);
            }));
        }
        return new (P || (P = Promise))((function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        }));
    }
    typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };
    const EXPORT_API_PATH$1 = "management/content-export/v1";
    const requestAnExport = (environment, xAuthToken, sourcePath, modifiedAfter, projectId = "core", dataTypes = [ "resourcebundle", "page", "resourcebundle", "folder" ]) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${EXPORT_API_PATH$1}/`, {
            method: "POST",
            headers: {
                "x-auth-token": xAuthToken
            },
            data: Object.assign({
                dataTypes,
                sourcePath,
                branch: projectId
            }, modifiedAfter ? {
                modifiedAfter
            } : {})
        });
        return response;
    }));
    const getOperationDetails = (environment, xAuthToken, operationId) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${EXPORT_API_PATH$1}/operations/${operationId}`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const downloadExportedFiles = (environment, xAuthToken, operationId) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${EXPORT_API_PATH$1}/operations/${operationId}/files`, {
            method: "GET",
            responseType: "arraybuffer",
            headers: {
                "x-auth-token": xAuthToken,
                accept: "application/octet-stream"
            }
        });
        return response;
    }));
    const EXPORT_API_PATH = "management/content-import/v1";
    const getImportOperationStatus = (environment, xAuthToken, operationId) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${EXPORT_API_PATH}/operations/${operationId}`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const CONTENT_TYPE_API_PATH = "management/contenttypes/v1";
    const getAllContentTypes = (environment, xAuthToken, projectId = "development") => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${CONTENT_TYPE_API_PATH}/${projectId}`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const getContentType = (environment, xAuthToken, contentTypeName, projectId = "development") => __awaiter(void 0, void 0, void 0, (function*() {
        const contentType = contentTypeName.replace(":", "-");
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${CONTENT_TYPE_API_PATH}/${projectId}/${contentType}`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const putContentType = (environment, xAuthToken, contentTypeName, data, optXResourceVersion) => __awaiter(void 0, void 0, void 0, (function*() {
        const contentType = contentTypeName.replace(":", "-");
        const url = `https://${environment}.bloomreach.io/${CONTENT_TYPE_API_PATH}/development/${contentType}`;
        const response = yield axios__default["default"](url, {
            method: "PUT",
            headers: Object.assign({
                "x-auth-token": xAuthToken,
                accept: "application/json",
                "content-type": "application/json"
            }, optXResourceVersion && {
                "x-resource-version": optXResourceVersion
            }),
            data
        });
        return response;
    }));
    const deleteContentType = (environment, xAuthToken, contentType) => __awaiter(void 0, void 0, void 0, (function*() {
        contentType = contentType.replace(":", "-");
        const response = yield axios__default["default"](`/api/contenttypes/${contentType}?environment=${environment}`, {
            method: "DELETE",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const CONTENT_API_PATH = "management/content/v1";
    const getPage = (environment, xAuthToken, channel, path, projectId) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${CONTENT_API_PATH}/project/${projectId}/channel/${channel}/page/${path}`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const putPage = (environment, xAuthToken, projectId, channel, path, pageData, optXResourceVersion) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${CONTENT_API_PATH}/project/${projectId}/channel/${channel}/page/${path}`, {
            method: "PUT",
            headers: Object.assign({
                "x-auth-token": xAuthToken,
                Accept: "application/json",
                "Content-Type": "application/json"
            }, optXResourceVersion && {
                "x-resource-version": optXResourceVersion
            }),
            data: pageData
        });
        return response;
    }));
    const FOLDER_API_PATH = "management/folder/v1";
    const getFolder = (environment, xAuthToken, folderPath, depth = "5") => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${FOLDER_API_PATH}/${folderPath}?depth=${depth}`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const createOrUpdateFolder = (environment, xAuthToken, folderType, folderPath, displayName, optAllowedDocumentTypes, optAllowedFolderTypes) => __awaiter(void 0, void 0, void 0, (function*() {
        const allowedDocumentTypes = optAllowedDocumentTypes || [ "ALL_DOCUMENTS" ];
        const allowedFolderTypes = optAllowedFolderTypes || [ "FOLDER" ];
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${FOLDER_API_PATH}/${folderPath}`, {
            method: "PUT",
            headers: {
                "x-auth-token": xAuthToken,
                "Content-Type": "application/json"
            },
            data: {
                type: folderType,
                path: folderPath,
                displayName,
                allowedDocumentTypes,
                allowedFolderTypes
            }
        });
        return response;
    }));
    const PROJECTS_API_PATH = "management/projects/v1";
    const getAllProjects = (environment, xAuthToken) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${PROJECTS_API_PATH}/`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const getDeveloperProject = (environment, xAuthToken, projectId) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${PROJECTS_API_PATH}/${projectId}`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const createDeveloperProject = (environment, xAuthToken, name, includeContentTypes, description = "") => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${PROJECTS_API_PATH}/`, {
            method: "POST",
            headers: {
                "x-auth-token": xAuthToken,
                "Content-Type": "application/json"
            },
            data: {
                name,
                includeContentTypes,
                description
            }
        });
        return response;
    }));
    const updateProject = (environment, xAuthToken, projectId, name, includeContentTypes, description = "") => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${PROJECTS_API_PATH}/${projectId}`, {
            method: "POST",
            headers: {
                "x-auth-token": xAuthToken,
                "Content-Type": "application/json"
            },
            data: {
                id: projectId,
                name,
                includeContentTypes,
                description
            }
        });
        return response;
    }));
    const mergeProject = (environment, xAuthToken, projectId) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${PROJECTS_API_PATH}/${projectId}:merge`, {
            method: "POST",
            headers: {
                "x-auth-token": xAuthToken,
                "Content-Type": "application/json"
            },
            data: {
                approveAllChanges: true
            }
        });
        return response;
    }));
    const rebaseProject = (environment, xAuthToken, projectId) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${PROJECTS_API_PATH}/${projectId}:rebase`, {
            method: "POST",
            headers: {
                "x-auth-token": xAuthToken,
                "Content-Type": "application/json"
            }
        });
        return response;
    }));
    const reopenProject = (environment, xAuthToken, projectId) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${PROJECTS_API_PATH}/${projectId}:reopen`, {
            method: "POST",
            headers: {
                "x-auth-token": xAuthToken,
                "Content-Type": "application/json"
            }
        });
        return response;
    }));
    const deleteProject = (environment, xAuthToken, projectId) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`/api/projects/${projectId}?environment=${environment}`, {
            method: "DELETE",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const CHANNEL_API_PATH = "management/site/v1";
    const DELIVERY_CHANNEL_API_PATH = "delivery/site/v1";
    /**
     * Get all core channels from Delivery API
     * @param {string} environment
     * @returns
     */    const getAllCoreChannels = environment => __awaiter(void 0, void 0, void 0, (function*() {
        const url = `https://${environment}.bloomreach.io/${DELIVERY_CHANNEL_API_PATH}/channels`;
        const response = yield axios__default["default"](url, {
            method: "GET"
        });
        return response;
    }))
    /**
     * Get all channels
     * @param {string} environment
     * @param {string} xAuthToken
     * @returns
     */;
    const getAllChannels = (environment, xAuthToken) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }))
    /**
     * Get channel
     * @param {string} environment
     * @param {string} xAuthToken
     * @param {string} channelId
     * @returns
     */;
    const getChannel = (environment, xAuthToken, channelId) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }))
    /**
     * Put channel
     * @param {string} environment
     * @param {string} xAuthToken
     * @param {string} channelId
     * @param {object} data
     * @param {string=} opt_xResourceVersion
     * @returns
     */;
    const putChannel = (environment, xAuthToken, channelId, data, optXResourceVersion) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}`, {
            method: "PUT",
            headers: Object.assign({
                "x-auth-token": xAuthToken,
                Accept: "application/json",
                "Content-Type": "application/json"
            }, optXResourceVersion && {
                "x-resource-version": optXResourceVersion
            }),
            data
        });
        return response;
    }))
    /**
     * Add channel to project
     * @param {string} environment
     * @param {string} xAuthToken
     * @param {string} projectId
     * @param {string} channelId
     * @returns
     */;
    const addChannelToProject = (environment, xAuthToken, projectId, channelId) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels`, {
            method: "POST",
            headers: {
                "x-auth-token": xAuthToken
            },
            data: {
                branch: projectId,
                branchOf: channelId
            }
        });
        return response;
    }))
    /**
     * Deletes a channel branch
     * @param {string} environment
     * @param {string} xAuthToken
     * @param {string} channelId
     * @returns
     */;
    const deleteChannelBranch = (environment, xAuthToken, channelId) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}`, {
            method: "DELETE",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }))
    /**
     * Get channel fieldgroups
     * @param {string} environment
     * @param {string} xAuthToken
     * @param {string} channelId
     * @returns
     */;
    const getChannelFieldGroups = (environment, xAuthToken, channelId) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}/fieldgroups`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }))
    /**
     * Put channel fieldgroups
     * @param {string} environment
     * @param {string} xAuthToken
     * @param {string} channelId
     * @param {string} fieldGroup
     * @param {object} data
     * @param {string=} opt_xResourceVersion
     * @returns
     */;
    const putChannelFieldGroups = (environment, xAuthToken, channelId, fieldGroup, data, optXResourceVersion) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}/fieldgroups/${fieldGroup}`, {
            method: "PUT",
            headers: Object.assign({
                "x-auth-token": xAuthToken,
                Accept: "application/json",
                "Content-Type": "application/json"
            }, optXResourceVersion && {
                "x-resource-version": optXResourceVersion
            }),
            data
        });
        return response;
    }))
    /**
     * Delete channel fieldgroups
     * @param {string} environment
     * @param {string} xAuthToken
     * @param {string} channelId
     * @param {string} fieldGroup
     * @returns
     */;
    const deleteChannelFieldGroups = (environment, xAuthToken, channelId, fieldGroup) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}/fieldgroups/${fieldGroup}`, {
            method: "DELETE",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }))
    /**
     * Get channel parameters
     * @param {string} environment
     * @param {string} xAuthToken
     * @param {string} channelId
     * @returns
     */;
    const getChannelParameters = (environment, xAuthToken, channelId) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}/parameters`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }))
    /**
     * Get channel parameter
     * @param {string} environment
     * @param {string} xAuthToken
     * @param {string} channelId
     * @param {string} parameter
     * @returns
     */;
    const getChannelParameter = (environment, xAuthToken, channelId, parameter) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}/parameters/${parameter}`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }))
    /**
     * Put channel parameter
     * @param {string} environment
     * @param {string} xAuthToken
     * @param {string} channelId
     * @param {string} parameter
     * @param {object} data
     * @param {string=} opt_xResourceVersion
     * @returns
     */;
    const putChannelParameter = (environment, xAuthToken, channelId, parameter, data, optXResourceVersion) => __awaiter(void 0, void 0, void 0, (function*() {
        /** Sample data
         *
          {
            "name": "smAccountId",
            "valueType": "string",
            "required": true,
            "hidden": false,
            "overlay": false,
            "defaultValue": "",
            "displayName": "brSM Account ID RENAMED",
            "system": false,
            "config": null
          }
         */
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}/parameters/${parameter}`, {
            method: "PUT",
            headers: Object.assign({
                "x-auth-token": xAuthToken,
                Accept: "application/json",
                "Content-Type": "application/json"
            }, optXResourceVersion && {
                "x-resource-version": optXResourceVersion
            }),
            data
        });
        return response;
    }))
    /**
     * Delete channel parameter
     * @param {string} environment
     * @param {string} xAuthToken
     * @param {string} channelId
     * @param {string} parameter
     * @returns
     */;
    const deleteChannelParameter = (environment, xAuthToken, channelId, parameter) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}/parameters/${parameter}`, {
            method: "DELETE",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const SITE_MANAGEMENT_API_PATH$4 = "management/site/v1";
    /**
     * Get all component groups
     * @param {string} environment
     * @param {string} xAuthToken
     * @param {string} channelId
     * @returns
     */    const getAllComponentGroups = (environment, xAuthToken, channelId) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH$4}/channels/${channelId}/component_groups`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const getComponentGroup = (environment, xAuthToken, channelId, componentGroup) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH$4}/channels/${channelId}/component_groups/${componentGroup}`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const createComponentGroup = (environment, xAuthToken, channelId, componentGroup, data) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH$4}/channels/${channelId}/component_groups/${componentGroup}`, {
            method: "PUT",
            headers: {
                "x-auth-token": xAuthToken
            },
            data
        });
        return response;
    }));
    const deleteComponentGroup = (environment, xAuthToken, channelId, componentGroup) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH$4}/channels/${channelId}/component_groups/${componentGroup}`, {
            method: "DELETE",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const SITE_MANAGEMENT_API_PATH$3 = "management/site/v1";
    const getAllComponents = (environment, xAuthToken, channelId, componentGroup) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH$3}/channels/${channelId}/component_groups/${componentGroup}/components/`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const getComponent = (environment, xAuthToken, channelId, componentGroup, componentName) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH$3}/channels/${channelId}/component_groups/${componentGroup}/components/${componentName}`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const putComponent = (environment, xAuthToken, channelId, componentGroup, componentName, data, optXResourceVersion) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH$3}/channels/${channelId}/component_groups/${componentGroup}/components/${componentName}`, {
            method: "PUT",
            headers: Object.assign({
                "x-auth-token": xAuthToken
            }, optXResourceVersion && {
                "x-resource-version": optXResourceVersion
            }),
            data
        });
        return response;
    }));
    const deleteComponent = (environment, xAuthToken, channelId, componentGroup, componentName) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH$3}/channels/${channelId}/component_groups/${componentGroup}/components/${componentName}`, {
            method: "DELETE",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const SITE_MANAGEMENT_API_PATH$2 = "management/site/v1";
    const getAllLayouts = (environment, xAuthToken, channelId) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH$2}/channels/${channelId}/layouts`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const getLayout = (environment, xAuthToken, channelId, layout) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH$2}/channels/${channelId}/layouts/${layout}`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const putLayout = (environment, xAuthToken, channelId, layout, data, optXResourceVersion) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH$2}/channels/${channelId}/layouts/${layout}`, {
            method: "PUT",
            headers: Object.assign({
                "x-auth-token": xAuthToken
            }, optXResourceVersion && {
                "x-resource-version": optXResourceVersion
            }),
            data
        });
        return response;
    }));
    const deleteLayout = (environment, xAuthToken, channelId, layout) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH$2}/channels/${channelId}/layouts/${layout}`, {
            method: "DELETE",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const SITE_MANAGEMENT_API_PATH$1 = "management/site/v1";
    const getAllRoutes = (environment, xAuthToken, channelId) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH$1}/channels/${channelId}/routes`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const getRoute = (environment, xAuthToken, channelId, route) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH$1}/channels/${channelId}/routes/${route}`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const putRoute = (environment, xAuthToken, channelId, route, data, optXResourceVersion) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH$1}/channels/${channelId}/routes/${route}`, {
            method: "PUT",
            headers: Object.assign({
                "x-auth-token": xAuthToken
            }, optXResourceVersion && {
                "x-resource-version": optXResourceVersion
            }),
            data
        });
        return response;
    }));
    const deleteRoute = (environment, xAuthToken, channelId, route) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH$1}/channels/${channelId}/routes/${route}`, {
            method: "DELETE",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const SITE_MANAGEMENT_API_PATH = "management/site/v1";
    const getAllMenus = (environment, xAuthToken, channelId) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/menus`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const getMenu = (environment, xAuthToken, channelId, menu) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/menus/${menu}`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const putMenu = (environment, xAuthToken, channelId, menu, data, optXResourceVersion) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/menus/${menu}`, {
            method: "PUT",
            headers: Object.assign({
                "x-auth-token": xAuthToken
            }, optXResourceVersion && {
                "x-resource-version": optXResourceVersion
            }),
            data
        });
        return response;
    }));
    const getMenuItems = (environment, xAuthToken, channelId, menu) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/menus/${menu}/items`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const putMenuItems = (environment, xAuthToken, channelId, menu, data, optXResourceVersion) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/menus/${menu}/items`, {
            method: "PUT",
            headers: Object.assign({
                "x-auth-token": xAuthToken
            }, optXResourceVersion && {
                "x-resource-version": optXResourceVersion
            }),
            data
        });
        return response;
    }));
    const getMenuProperties = (environment, xAuthToken, channelId, menu) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/menus/${menu}/properties`, {
            method: "GET",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    const putMenuProperties = (environment, xAuthToken, channelId, menu, data, optXResourceVersion) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/menus/${menu}/properties`, {
            method: "PUT",
            headers: Object.assign({
                "x-auth-token": xAuthToken
            }, optXResourceVersion && {
                "x-resource-version": optXResourceVersion
            }),
            data
        });
        return response;
    }));
    const deleteMenu = (environment, xAuthToken, channelId, menu) => __awaiter(void 0, void 0, void 0, (function*() {
        const response = yield axios__default["default"](`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/menus/${menu}`, {
            method: "DELETE",
            headers: {
                "x-auth-token": xAuthToken
            }
        });
        return response;
    }));
    exports.addChannelToProject = addChannelToProject;
    exports.createComponentGroup = createComponentGroup;
    exports.createDeveloperProject = createDeveloperProject;
    exports.createOrUpdateFolder = createOrUpdateFolder;
    exports.deleteChannelBranch = deleteChannelBranch;
    exports.deleteChannelFieldGroups = deleteChannelFieldGroups;
    exports.deleteChannelParameter = deleteChannelParameter;
    exports.deleteComponent = deleteComponent;
    exports.deleteComponentGroup = deleteComponentGroup;
    exports.deleteContentType = deleteContentType;
    exports.deleteLayout = deleteLayout;
    exports.deleteMenu = deleteMenu;
    exports.deleteProject = deleteProject;
    exports.deleteRoute = deleteRoute;
    exports.downloadExportedFiles = downloadExportedFiles;
    exports.getAllChannels = getAllChannels;
    exports.getAllComponentGroups = getAllComponentGroups;
    exports.getAllComponents = getAllComponents;
    exports.getAllContentTypes = getAllContentTypes;
    exports.getAllCoreChannels = getAllCoreChannels;
    exports.getAllLayouts = getAllLayouts;
    exports.getAllMenus = getAllMenus;
    exports.getAllProjects = getAllProjects;
    exports.getAllRoutes = getAllRoutes;
    exports.getChannel = getChannel;
    exports.getChannelFieldGroups = getChannelFieldGroups;
    exports.getChannelParameter = getChannelParameter;
    exports.getChannelParameters = getChannelParameters;
    exports.getComponent = getComponent;
    exports.getComponentGroup = getComponentGroup;
    exports.getContentType = getContentType;
    exports.getDeveloperProject = getDeveloperProject;
    exports.getFolder = getFolder;
    exports.getImportOperationStatus = getImportOperationStatus;
    exports.getLayout = getLayout;
    exports.getMenu = getMenu;
    exports.getMenuItems = getMenuItems;
    exports.getMenuProperties = getMenuProperties;
    exports.getOperationDetails = getOperationDetails;
    exports.getPage = getPage;
    exports.getRoute = getRoute;
    exports.mergeProject = mergeProject;
    exports.putChannel = putChannel;
    exports.putChannelFieldGroups = putChannelFieldGroups;
    exports.putChannelParameter = putChannelParameter;
    exports.putComponent = putComponent;
    exports.putContentType = putContentType;
    exports.putLayout = putLayout;
    exports.putMenu = putMenu;
    exports.putMenuItems = putMenuItems;
    exports.putMenuProperties = putMenuProperties;
    exports.putPage = putPage;
    exports.putRoute = putRoute;
    exports.rebaseProject = rebaseProject;
    exports.reopenProject = reopenProject;
    exports.requestAnExport = requestAnExport;
    exports.updateProject = updateProject;
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
}));
//# sourceMappingURL=index.umd.js.map
