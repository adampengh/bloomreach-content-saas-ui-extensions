import { getFolder } from 'api/folder'

describe('getFolder', () => {
    it('returns a folder object', async () => {

        const folder = await getFolder(global.environment, global.xAuthToken, global.folderPath)
            .then(response => response.data)

        await expect(typeof folder).toBe('object')
    })
})
