import { AxiosPromise } from 'axios';

declare const requestAnExport: (environment: string, xAuthToken: string, sourcePath: string, modifiedAfter: string, projectId?: string, dataTypes?: string[]) => AxiosPromise<any>;
declare const getOperationDetails: (environment: string, xAuthToken: string, operationId: string) => AxiosPromise<any>;
declare const downloadExportedFiles: (environment: string, xAuthToken: string, operationId: string) => AxiosPromise<any>;

declare const getImportOperationStatus: (environment: string, xAuthToken: string, operationId: string) => AxiosPromise<any>;

declare const getAllContentTypes: (environment: string, xAuthToken: string, projectId?: string) => AxiosPromise<any>;
declare const getContentType: (environment: string, xAuthToken: string, contentTypeName: string, projectId?: string) => AxiosPromise<any>;
declare const putContentType: (environment: string, xAuthToken: string, contentTypeName: string, data: any, optXResourceVersion: string) => AxiosPromise<any>;
declare const deleteContentType: (environment: string, xAuthToken: string, contentType: string) => AxiosPromise<any>;

declare const getPage: (environment: string, xAuthToken: string, channel: string, path: string, projectId: string) => AxiosPromise<any>;
declare const putPage: (environment: string, xAuthToken: string, projectId: string, channel: string, path: string, pageData: any, optXResourceVersion: string) => AxiosPromise<any>;

declare const getFolder: (environment: string, xAuthToken: string, folderPath: string, depth?: string) => AxiosPromise<any>;
declare const createOrUpdateFolder: (environment: string, xAuthToken: string, folderType: string, folderPath: string, displayName: string, optAllowedDocumentTypes: Array<string>, optAllowedFolderTypes: Array<string>) => AxiosPromise<any>;

declare const getAllProjects: (environment: string, xAuthToken: string) => AxiosPromise<any>;
declare const getDeveloperProject: (environment: string, xAuthToken: string, projectId: string) => AxiosPromise<any>;
declare const createDeveloperProject: (environment: string, xAuthToken: string, name: string, includeContentTypes: boolean, description?: string) => AxiosPromise<any>;
declare const updateProject: (environment: string, xAuthToken: string, projectId: string, name: string, includeContentTypes: boolean, description?: string) => AxiosPromise<any>;
declare const mergeProject: (environment: string, xAuthToken: string, projectId: string) => AxiosPromise<any>;
declare const rebaseProject: (environment: string, xAuthToken: string, projectId: string) => AxiosPromise<any>;
declare const reopenProject: (environment: string, xAuthToken: string, projectId: string) => AxiosPromise<any>;
declare const deleteProject: (environment: string, xAuthToken: string, projectId: string) => AxiosPromise<any>;

/**
 * Get all core channels from Delivery API
 * @param {string} environment
 * @returns
 */
declare const getAllCoreChannels: (environment: string) => AxiosPromise<any>;
/**
 * Get all channels
 * @param {string} environment
 * @param {string} xAuthToken
 * @returns
 */
declare const getAllChannels: (environment: string, xAuthToken: string) => AxiosPromise<any>;
/**
 * Get channel
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @returns
 */
declare const getChannel: (environment: string, xAuthToken: string, channelId: string) => AxiosPromise<any>;
/**
 * Put channel
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @param {object} data
 * @param {string=} opt_xResourceVersion
 * @returns
 */
declare const putChannel: (environment: string, xAuthToken: string, channelId: string, data: any, optXResourceVersion: string) => AxiosPromise<any>;
/**
 * Add channel to project
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} projectId
 * @param {string} channelId
 * @returns
 */
declare const addChannelToProject: (environment: string, xAuthToken: string, projectId: string, channelId: string) => AxiosPromise<any>;
/**
 * Deletes a channel branch
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @returns
 */
declare const deleteChannelBranch: (environment: string, xAuthToken: string, channelId: string) => AxiosPromise<any>;
/**
 * Get channel fieldgroups
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @returns
 */
declare const getChannelFieldGroups: (environment: string, xAuthToken: string, channelId: string) => AxiosPromise<any>;
/**
 * Put channel fieldgroups
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @param {string} fieldGroup
 * @param {object} data
 * @param {string=} opt_xResourceVersion
 * @returns
 */
declare const putChannelFieldGroups: (environment: string, xAuthToken: string, channelId: string, fieldGroup: string, data: any, optXResourceVersion: string) => AxiosPromise<any>;
/**
 * Delete channel fieldgroups
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @param {string} fieldGroup
 * @returns
 */
declare const deleteChannelFieldGroups: (environment: string, xAuthToken: string, channelId: string, fieldGroup: string) => AxiosPromise<any>;
/**
 * Get channel parameters
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @returns
 */
declare const getChannelParameters: (environment: string, xAuthToken: string, channelId: string) => AxiosPromise<any>;
/**
 * Get channel parameter
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @param {string} parameter
 * @returns
 */
declare const getChannelParameter: (environment: string, xAuthToken: string, channelId: string, parameter: string) => AxiosPromise<any>;
/**
 * Put channel parameter
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @param {string} parameter
 * @param {object} data
 * @param {string=} opt_xResourceVersion
 * @returns
 */
declare const putChannelParameter: (environment: string, xAuthToken: string, channelId: string, parameter: string, data: object, optXResourceVersion: string) => AxiosPromise<any>;
/**
 * Delete channel parameter
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @param {string} parameter
 * @returns
 */
declare const deleteChannelParameter: (environment: string, xAuthToken: string, channelId: string, parameter: string) => AxiosPromise<any>;

/**
 * Get all component groups
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @returns
 */
declare const getAllComponentGroups: (environment: string, xAuthToken: string, channelId: string) => AxiosPromise<any>;
declare const getComponentGroup: (environment: string, xAuthToken: string, channelId: string, componentGroup: string) => AxiosPromise<any>;
declare const createComponentGroup: (environment: string, xAuthToken: string, channelId: string, componentGroup: string, data: object) => AxiosPromise<any>;
declare const deleteComponentGroup: (environment: string, xAuthToken: string, channelId: string, componentGroup: string) => AxiosPromise<any>;

declare const getAllComponents: (environment: string, xAuthToken: string, channelId: string, componentGroup: string) => AxiosPromise<any>;
declare const getComponent: (environment: string, xAuthToken: string, channelId: string, componentGroup: string, componentName: string) => AxiosPromise<any>;
declare const putComponent: (environment: string, xAuthToken: string, channelId: string, componentGroup: string, componentName: string, data: object, optXResourceVersion: string) => AxiosPromise<any>;
declare const deleteComponent: (environment: string, xAuthToken: string, channelId: string, componentGroup: string, componentName: string) => AxiosPromise<any>;

declare const getAllLayouts: (environment: string, xAuthToken: string, channelId: string) => AxiosPromise<any>;
declare const getLayout: (environment: string, xAuthToken: string, channelId: string, layout: string) => AxiosPromise<any>;
declare const putLayout: (environment: string, xAuthToken: string, channelId: string, layout: string, data: object, optXResourceVersion: string) => AxiosPromise<any>;
declare const deleteLayout: (environment: string, xAuthToken: string, channelId: string, layout: string) => AxiosPromise<any>;

declare const getAllRoutes: (environment: string, xAuthToken: string, channelId: string) => AxiosPromise<any>;
declare const getRoute: (environment: string, xAuthToken: string, channelId: string, route: string) => AxiosPromise<any>;
declare const putRoute: (environment: string, xAuthToken: string, channelId: string, route: string, data: object, optXResourceVersion: string) => AxiosPromise<any>;
declare const deleteRoute: (environment: string, xAuthToken: string, channelId: string, route: string) => AxiosPromise<any>;

declare const getAllMenus: (environment: string, xAuthToken: string, channelId: string) => AxiosPromise<any>;
declare const getMenu: (environment: string, xAuthToken: string, channelId: string, menu: string) => AxiosPromise<any>;
declare const putMenu: (environment: string, xAuthToken: string, channelId: string, menu: string, data: object, optXResourceVersion: string) => AxiosPromise<any>;
declare const getMenuItems: (environment: string, xAuthToken: string, channelId: string, menu: string) => AxiosPromise<any>;
declare const putMenuItems: (environment: string, xAuthToken: string, channelId: string, menu: string, data: object, optXResourceVersion: string) => AxiosPromise<any>;
declare const getMenuProperties: (environment: string, xAuthToken: string, channelId: string, menu: string) => AxiosPromise<any>;
declare const putMenuProperties: (environment: string, xAuthToken: string, channelId: string, menu: string, data: object, optXResourceVersion: string) => AxiosPromise<any>;
declare const deleteMenu: (environment: string, xAuthToken: string, channelId: string, menu: string) => AxiosPromise<any>;

export { addChannelToProject, createComponentGroup, createDeveloperProject, createOrUpdateFolder, deleteChannelBranch, deleteChannelFieldGroups, deleteChannelParameter, deleteComponent, deleteComponentGroup, deleteContentType, deleteLayout, deleteMenu, deleteProject, deleteRoute, downloadExportedFiles, getAllChannels, getAllComponentGroups, getAllComponents, getAllContentTypes, getAllCoreChannels, getAllLayouts, getAllMenus, getAllProjects, getAllRoutes, getChannel, getChannelFieldGroups, getChannelParameter, getChannelParameters, getComponent, getComponentGroup, getContentType, getDeveloperProject, getFolder, getImportOperationStatus, getLayout, getMenu, getMenuItems, getMenuProperties, getOperationDetails, getPage, getRoute, mergeProject, putChannel, putChannelFieldGroups, putChannelParameter, putComponent, putContentType, putLayout, putMenu, putMenuItems, putMenuProperties, putPage, putRoute, rebaseProject, reopenProject, requestAnExport, updateProject };
