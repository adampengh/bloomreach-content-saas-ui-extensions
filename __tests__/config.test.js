describe('config vars', () => {
  it('should return environment variable', () => {
    const environment = global.environment
    expect(environment).not.toBeNull
    expect(typeof environment).toBe('string')
    expect(environment.length).toBeGreaterThan(0)
  })
  it('should return xAuthToken variable', () => {
    const token = global.xAuthToken
    expect(token).not.toBeNull
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)
  })
  // it('should return channel variable', () => {
  //     expect(typeof global.channelId).toBe('string')
  // })
  // it('should return path variable', () => {
  //     expect(typeof global.path).toBe('string')
  // })
})
