export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    tourPath: string
    locale: string
    enableMock: boolean
    url: string
}
const appConfig: AppConfig = {
    apiPrefix: '/api',
    authenticatedEntryPath: '/home',
    unAuthenticatedEntryPath: '/sign-in',
    tourPath: '/',
    locale: 'en',
    enableMock: false,
    url:
        import.meta.env.MODE === 'production'
            ? import.meta.env.VITE_APP_PRODUCTION_URL ?? ''
            : import.meta.env.VITE_APP_DEVELOPMENT_URL ??
              'http://127.0.0.1:8000',
}

export default appConfig
