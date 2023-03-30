describe('config vars', () => {
    it('should return environment variable', () => {
        expect(typeof global.environment).toBe('string')
        expect(global.environment).toBe('profserv02')
    })
    it('should return xAuthToken variable', () => {
        expect(typeof global.xAuthToken).toBe('string')
        expect(global.xAuthToken).toBe('76c52a73-27a6-41d4-a347-35cc7aa1a42b')
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
