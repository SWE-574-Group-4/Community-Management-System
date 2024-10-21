import dotenv from 'dotenv'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dynamicImport from 'vite-plugin-dynamic-import'
import { VitePWA } from 'vite-plugin-pwa'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
    return {
        base: '/',
        plugins: [
            react({
                babel: {
                    plugins: ['babel-plugin-macros'],
                },
            }),
            dynamicImport(),
            VitePWA({
                registerType: 'autoUpdate',
                includeAssets: [
                    'favicon.ico',
                    'apple-touch-icon.png',
                    'mask-icon.svg',
                ],
                manifest: {
                    name: 'communiche',
                    short_name: 'communiche',
                    theme_color: '#ffffff',
                    icons: [
                        {
                            src: 'pwa-64x64.png',
                            sizes: '64x64',
                            type: 'image/png',
                        },
                        {
                            src: 'pwa-192x192.png',
                            sizes: '192x192',
                            type: 'image/png',
                        },
                        {
                            src: 'pwa-512x512.png',
                            sizes: '512x512',
                            type: 'image/png',
                            purpose: 'any',
                        },
                        {
                            src: 'maskable-icon-512x512.png',
                            sizes: '512x512',
                            type: 'image/png',
                            purpose: 'maskable',
                        },
                    ],
                },
                workbox: {
                    runtimeCaching: [
                        {
                            urlPattern: ({ url }) => {
                                return url.pathname.startsWith(
                                    `${process.env.REACT_APP_API_BASE_URL}`
                                )
                            },
                            handler: 'CacheFirst',
                            options: {
                                cacheName: 'api-cache',
                                cacheableResponse: {
                                    statuses: [0, 200],
                                },
                            },
                        },
                    ],
                },
            }),
        ],
        assetsInclude: ['**/*.md'],
        resolve: {
            alias: {
                '@': path.join(__dirname, 'src'),
            },
        },
        build: {
            outDir: 'build',
        },
        define: {
            'process.env': process.env,
        },
        preview: {
            port: 5173,
        },
        server: {
            cors: {
                origin: '*', // Allow all origins
                methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
                allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
            },
        },
    }
})
