import { getAllCoreChannels } from 'api'

describe('getAllCoreChannels', () => {
    it('returns an array of core channels', async () => {
        console.log('getAllCoreChannels')
        const channels = await getAllCoreChannels(global.environment, global.xAuthToken)
            .then(response => {
              console.log(response.data)
              return response.data
            })

        await expect(typeof channels).toBe('array')
    })
})
