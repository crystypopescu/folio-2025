/** @type {import('next').NextConfig} */
const nextConfig = {
  // Client-side rendering for WebGPU game
  reactStrictMode: false, // Prevent double initialization

  // Asset optimization
  images: {
    unoptimized: true, // We handle compression with scripts/compress.js
  },

  // Webpack configuration for special dependencies
  webpack: (config, { isServer }) => {
    // WASM support (for Rapier physics)
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
    }

    // Node polyfills (msgpack-lite, etc.)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: 'buffer',
      }
    }

    // Handle .glb, .gltf files as assets
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
    })

    // Handle .ktx files as assets
    config.module.rules.push({
      test: /\.ktx$/,
      type: 'asset/resource',
    })

    // Exclude Three.js from server bundle
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'three/webgpu': 'three/webgpu',
        'three/tsl': 'three/tsl',
      })
    }

    return config
  },

  // Transpile specific packages if needed
  transpilePackages: ['three'],
}

export default nextConfig
