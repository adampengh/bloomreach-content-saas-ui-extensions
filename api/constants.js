const version = 'v1'

export const CONSTANTS = {
    CONTENT_TYPE_API_PATH: `management/site/${version}`,
    EXPORT_API_PATH: `management/content-export/${version}`,
    SITE: {
        CHANNEL_API_PATH: `management/site/${version}`,
    }
}

export const ERROR_CODES = {
  403: 'Forbidden',
  409: 'Conflict',
  415: '',
}
