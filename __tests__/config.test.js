describe('config vars', () => {
    it('should return environment variable', () => {
        expect(typeof global.environment).toBe('string')
    })
    it('should return xAuthToken variable', () => {
        expect(typeof global.xAuthToken).toBe('string')
    })
    it('should return channel variable', () => {
        expect(typeof global.channel).toBe('string')
    })
    it('should return path variable', () => {
        expect(typeof global.path).toBe('string')
    })
})
