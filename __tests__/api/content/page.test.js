import { getPage } from 'api/content/page'

describe('getPage', () => {
    it('returns a page object', async () => {
        await getPage(global.environment, global.xAuthToken, global.channel, global.path)
            .then(response => {
                const page = response.data
                expect(typeof page).toBe('object')
                expect(page.name).toBe('test-page')
                expect(page.layout).toBe('one-column')
            })
            .catch((error) => {
                expect(error.name).toBe('AxiosError')
            })
    })
})
