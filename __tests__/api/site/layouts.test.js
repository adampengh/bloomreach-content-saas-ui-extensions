import {
  getAllLayouts,
  getLayout,
  putLayout,
  deleteLayout
} from 'api'
import { testLayout } from 'mock-data/test-layout'

describe('Get All Layouts', () => {
  it('returns an object of all layouts', async () => {
    const channels = await getAllLayouts(global.environment, global.xAuthToken, global.channelId)
      .then(response => {
        console.log(response.data)
        return response.data
      })

    await expect(typeof channels).toBe('object')
  })
})


describe('Create Layout', () => {
  it('creates a new layout', async () => {
    const status = await putLayout(global.environment, global.xAuthToken, global.channelId, global.layout, testLayout)
      .then(response => {
        console.log('putLayout', response.status)
        return response.status
      })
      .catch(error => {
        console.error('putLayout', error)
        return error.response.status
      })

    await expect(status).toEqual(201)
  })
})


describe('Get Layout', () => {
  it('returns the newly created layout', async () => {
    const layout = await getLayout(global.environment, global.xAuthToken, global.channelId, global.layout)
      .then(response => {
        console.log('getLayout', response.data)
        return response.data
      })

    await expect(typeof layout).toBe('object')
    await expect(layout.name).toEqual(global.layout)
  })
})


// describe('Delete Layout', () => {
//   it('deletes the newly created layout', async () => {
//     const status = await deleteLayout(global.environment, global.xAuthToken, global.channelId, global.layout)
//       .then(response => {
//         console.log('deleteLayout', response.status)
//         return response.status
//       })
//       .catch(error => {
//         console.error('deleteLayout', error)
//         return error.response.status
//       })

//     await expect(status).toEqual(200)
//   })
// })
