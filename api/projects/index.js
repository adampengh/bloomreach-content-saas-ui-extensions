import axios from 'axios';

const PROJECTS_API_PATH = 'management/projects/v1'

export const getAllProjects = async (environment, xAuthToken) => {
    console.groupCollapsed('Project Management API: getAllProjects()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)

    const response = await axios(`https://${environment}.bloomreach.io/${PROJECTS_API_PATH}/`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    console.log('response', response.data)
    console.groupEnd()

    return response;
}

export const getDeveloperProject = async (environment, xAuthToken, projectId) => {
    console.groupCollapsed('Project Management API: getDeveloperProject()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)
    console.log('projectId:', projectId)

    const response = await axios(`https://${environment}.bloomreach.io/${PROJECTS_API_PATH}/${projectId}`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    console.log('response', response.data)
    console.groupEnd()

    return response;
}

export const createDeveloperProject = async (environment, xAuthToken, name, includeContentTypes, description = '') => {
    console.groupCollapsed('Project Management API: createDeveloperProject()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)
    console.log('name:', name)
    console.log('includeContentTypes:', includeContentTypes)
    console.log('description:', description)

    const response = await axios(`https://${environment}.bloomreach.io/${PROJECTS_API_PATH}/`, {
        method: 'POST',
        headers: {
            'x-auth-token': xAuthToken,
            'Content-Type': 'application/json',
        },
        data: {
            name,
            includeContentTypes,
            description
        }
    })

    console.log('response', response.data)
    console.groupEnd()

    return response;
}

export const updateProject = async (environment, xAuthToken, projectId, name, includeContentTypes, description = '') => {
    console.groupCollapsed('Project Management API: updateProject()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)
    console.log('projectId:', projectId)
    console.log('name:', name)
    console.log('includeContentTypes:', includeContentTypes)
    console.log('description:', description)

    const response = await axios(`https://${environment}.bloomreach.io/${PROJECTS_API_PATH}/${projectId}`, {
        method: 'POST',
        headers: {
            'x-auth-token': xAuthToken,
            'Content-Type': 'application/json',
        },
        data: {
            id: projectId,
            name,
            includeContentTypes,
            description
        }
    })

    console.log('response', response.data)
    console.groupEnd()

    return response;
}

export const mergeProject = async (environment, xAuthToken, projectId) => {
    console.groupCollapsed('Project Management API: mergeProject()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)
    console.log('projectId:', projectId)

    const response = await axios(`https://${environment}.bloomreach.io/${PROJECTS_API_PATH}/${projectId}:merge`, {
        method: 'POST',
        headers: {
            'x-auth-token': xAuthToken,
            'Content-Type': 'application/json',
        },
        data: {
            "approveAllChanges": true
        }
    })

    console.log('response', response.data)
    console.groupEnd()

    return response;
}

export const rebaseProject = async (environment, xAuthToken, projectId) => {
    console.groupCollapsed('Project Management API: rebaseProject()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)
    console.log('projectId:', projectId)

    const response = await axios(`https://${environment}.bloomreach.io/${PROJECTS_API_PATH}/${projectId}:rebase`, {
        method: 'POST',
        headers: {
            'x-auth-token': xAuthToken,
            'Content-Type': 'application/json',
        }
    })

    console.log('response', response.data)
    console.groupEnd()

    return response;
}

export const reopenProject = async (environment, xAuthToken, projectId) => {
    console.groupCollapsed('Project Management API: reopenProject()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)
    console.log('projectId:', projectId)

    const response = await axios(`https://${environment}.bloomreach.io/${PROJECTS_API_PATH}/${projectId}:reopen`, {
        method: 'POST',
        headers: {
            'x-auth-token': xAuthToken,
            'Content-Type': 'application/json',
        }
    })

    console.log('response', response.data)
    console.groupEnd()

    return response;
}

export const deleteProject = async (environment, xAuthToken, projectId) => {
    console.groupCollapsed('Project Management API: deleteProject()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)
    console.log('projectId:', projectId)

    const response = await axios(`/api/projects/${projectId}?environment=${environment}`, {
      method: 'DELETE',
      headers: {
        'x-auth-token': xAuthToken
      }
    })

    console.log('response', response.data)
    console.groupEnd()

    return response;
}
