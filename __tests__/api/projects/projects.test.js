import {
    createDeveloperProject,
    deleteProject,
    getAllProjects,
} from 'api'

let projectId = ''

describe('Get All Projects', () => {
    it('returns all developer projects', async () => {
        await getAllProjects(global.environment, global.xAuthToken)
            .then(response => {
                console.log(response.data)
            })
            .catch((error) => {
                expect(error.name).toBe('AxiosError')
            })
    })
})

describe('Create a Project', () => {
    it('Creates a project', async () => {
        await createDeveloperProject(global.environment, global.xAuthToken, 'Test Project', false)
            .then(response => {
                projectId = response.data.id
            })
            .catch((error) => {
                expect(error.name).toBe('AxiosError')
            })

        console.log('projectId', projectId)
    })
})

describe('Delete a Project', () => {
    it('Deletes a project', async () => {
        await deleteProject(global.environment, global.xAuthToken, projectId)
            .then(response => {
                console.log(response.data)
            })
            .catch((error) => {
                expect(error.name).toBe('AxiosError')
            })
    })
})
