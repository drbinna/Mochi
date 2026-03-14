import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
      inworldConfigPlugin(env.INWORLD_API_KEY),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],

    server: {
      proxy: {
        // Proxy /api/inworld/config → returns API key + ICE servers
        '/api/inworld/config': {
          target: 'https://api.inworld.ai',
          changeOrigin: true,
          configure: (_proxy, _options) => {
            // This proxy endpoint is handled by the custom middleware below
          },
        },
        // Proxy /api/inworld/calls → POST SDP offer to Inworld
        '/api/inworld/calls': {
          target: 'https://api.inworld.ai',
          changeOrigin: true,
          rewrite: () => '/v1/realtime/calls',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', `Bearer ${env.INWORLD_API_KEY}`)
            })
          },
        },
      },
    },

    // Custom plugin to handle /api/inworld/config endpoint
    // This returns the API key + ICE servers as JSON, keeping the key server-side
  }
})

// Vite plugin to serve /api/inworld/config as a virtual API endpoint
function inworldConfigPlugin(apiKey: string) {
  return {
    name: 'inworld-config',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url === '/api/inworld/config') {
          let iceServers: any[] = []
          try {
            const r = await fetch('https://api.inworld.ai/v1/realtime/ice-servers', {
              headers: { Authorization: `Bearer ${apiKey}` },
            })
            if (r.ok) {
              const data = await r.json()
              iceServers = data.ice_servers || []
            }
          } catch {
            // ICE servers are optional — WebRTC can work without them
          }

          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({
            api_key: apiKey,
            ice_servers: iceServers,
            url: '/api/inworld/calls',
          }))
          return
        }
        next()
      })
    },
  }
}
