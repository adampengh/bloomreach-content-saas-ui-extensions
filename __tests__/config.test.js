describe('config vars', () => {
    it('should return environment variable', () => {
        expect(typeof global.environment).toBe('string')
        expect(global.environment).toBe('profserv02')
    })
    it('should return xAuthToken variable', () => {
        expect(typeof global.xAuthToken).toBe('string')
        expect(global.xAuthToken).toBe('b6d9883f-3682-4e66-b51d-2f771903d5de')
    })
    it('should return channel variable', () => {
        expect(typeof global.channel).toBe('string')
        expect(global.channel).toBe('shared-english')
    })
    it('should return path variable', () => {
        expect(typeof global.path).toBe('string')
        expect(global.path).toBe('pages/test-page')
    })
})
