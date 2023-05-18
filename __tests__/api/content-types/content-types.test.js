import {
  getAllContentTypes,
  getContentType,
  putContentType,
  deleteContentType,
} from 'api'
import { testContentType } from 'mock-data/test-content-type';


describe('Get All Content Types', () => {
  it('returns an object of all content types', async () => {
    const contentTypes = await getAllContentTypes(global.environment, global.xAuthToken)
      .then(response => {
        return response.data
      })

    await expect(typeof contentTypes).toBe('object')
  })
})


describe('Create Content Type', () => {
  it('creates a new content type', async () => {
    const status = await putContentType(global.environment, global.xAuthToken, testContentType.name, testContentType)
      .then(response => {
        console.log('putContentType', response.status)
        return response.status
      })
      .catch(error => {
        console.error('putContentType', error)
        return error.response.status
      })

    await expect(status).toEqual(201)
  })
})


describe('Get Content Type', () => {
  it('returns a specific content type', async () => {
    const contentType = await getContentType(global.environment, global.xAuthToken, global.contentType)
      .then(response => {
        console.log(response.data)
        return response.data
      })

    await expect(typeof contentType).toBe('object')
    await expect(contentType.name).toEqual(global.contentType)
  })
})


// describe('Delete Content Type', () => {
//   it('deletes a specific content type', async () => {
//     const status = await deleteContentType(global.environment, global.xAuthToken, global.contentType)
//       .then(response => {
//         console.log('deleteContentType', response.status)
//         return response.status
//       })
//       .catch(error => {
//         console.error('deleteContentType', error)
//         return error.response.status
//       })

//     await expect(status).toEqual(200)
//   })
// })
