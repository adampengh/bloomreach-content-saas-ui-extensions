import {
  getAllComponentGroups,
  createComponentGroup,
  getComponentGroup,
  deleteComponentGroup
} from 'api'

describe('Get All Component Groups', () => {
  it('returns an object of all component groups', async () => {
    const channels = await getAllComponentGroups(global.environment, global.xAuthToken, global.channelId)
      .then(response => {
        console.log(response.data)
        return response.data
      })

    await expect(typeof channels).toBe('object')
  })
})


describe('Create Component Group', () => {
  it('creates a new component group', async () => {
    const data = {
      name: global.componentGroup,
      hidden: "false",
      system: "false"
    }

    const status = await createComponentGroup(global.environment, global.xAuthToken, global.channelId, global.componentGroup, data)
      .then(response => {
        console.log('createComponentGroup', response.status)
        return response.status
      })
      .catch(error => {
        console.error('createComponentGroup', error)
        return error.response.status
      })

    await expect(status).toEqual(201)
  })
})


describe('Get Component Group', () => {
  it('returns the newly created component group', async () => {
    const componentGroup = await getComponentGroup(global.environment, global.xAuthToken, global.channelId, global.componentGroup)
      .then(response => {
        console.log(response.data)
        return response.data
      })

    await expect(typeof componentGroup).toBe('object')
    await expect(componentGroup.name).toEqual(global.componentGroup)
  })
})


describe('Delete Component Group', () => {
  it('deletes the newly created component group', async () => {
    const status = await deleteComponentGroup(global.environment, global.xAuthToken, global.channelId, global.componentGroup)
      .then(response => {
        console.log('createComponentGroup', response.status)
        return response.status
      })
      .catch(error => {
        console.error('createComponentGroup', error)
        return error.response.status
      })

    await expect(status).toEqual(200)
  })
})
