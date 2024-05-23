import {defineConfig} from 'vite'
import {resolve} from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(),
        {
            name: 'rewrite-middleware',
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    const entries = ['/messenger/', '/idgen/'];
                    for (const e of entries) {
                        if (req.url.startsWith(e) && !req.url.startsWith(e + 'src') && !req.url.startsWith(e + 'api')) {
                            req.url = e;
                        }
                    }
                    next()
                })
            }
        }
    ],
    appType: "mpa",
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                idgen: resolve(__dirname, 'idgen/index.html'),
                messenger: resolve(__dirname, 'messenger/index.html'),
            },
        },
    },
    server: {
        port: 6111,
        open: true,
        proxy: {
            '/messenger/api': {
                target: 'http://localhost:8080',
            },
            '/idgen/api': {
                target: 'http://localhost:8080',
            },
            '/login': {
                target: 'http://localhost:8080',
            },
            '/logout': {
                target: 'http://localhost:8080',
            },
            '/operator': {
                target: 'http://localhost:8080',
            },
        },
    }
})
