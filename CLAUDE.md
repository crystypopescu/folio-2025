# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bruno Simon's 2025 portfolio - an interactive 3D vehicle experience built with Three.js WebGPU, Rapier physics engine, and Vite. The application features a game loop with physics-based vehicle controls, dynamic weather/day-night cycles, multiplayer support via WebSocket, and various visual effects.

## Development Commands

```bash
# Install dependencies (requires --force due to Three.js GitHub dependency)
npm install --force

# Development server (localhost:1234)
npm run dev

# Production build (outputs to dist/)
npm run build

# Preview production build
npm run preview

# Compress assets (GLB models, textures, UI images)
npm run compress
```

## Environment Setup

Create a `.env` file based on `.env.example`:
- `VITE_SERVER_URL`: WebSocket server URL for multiplayer (optional)
- `VITE_ANALYTICS_TAG`: Analytics tracking ID
- `VITE_GAME_PUBLIC`: Expose game instance on window object
- `VITE_DAY_CYCLE_PROGRESS`: Override day cycle position (0-1)
- `VITE_YEAR_CYCLE_PROGRESS`: Override year cycle position (0-1)
- `VITE_WHISPERS_COUNT`: Number of collectible whispers (default: 30)
- `VITE_MUSIC`: Enable/disable music
- `VITE_PLAYER_SPAWN`: Override player spawn position

## Architecture

### Game Loop & Execution Order

The game uses a tick-based system (`Ticker.js`) with a specific execution order (0-999) to manage dependencies between systems. This order is documented in the README and **must be respected** when adding new systems:

- **0-2**: Input & Pre-Physics (Time, Inputs, Player/Vehicle pre-physics)
- **3**: Physics engine step (Rapier)
- **4-6**: Physics result processing (Objects, PhysicalVehicle, Player post-physics)
- **7**: View/Camera update
- **8-9**: Rendering prep (Intro, Cycles, Weather, Zones, Wind, Lighting, Tornado, etc.)
- **10**: Visual effects (Area, Foliage, Fog, Terrain, Trails, Water, Particles, etc.)
- **13-14**: Instanced rendering, Audio, Notifications, Title
- **998**: Rendering
- **999**: Monitoring/Debug

Systems register with the ticker using `this.game.ticker.events.on('tick', callback, priority)`.

### Core Singleton: Game.js

The `Game` class is a singleton that bootstraps all systems. Access via `Game.getInstance()`. Initialization happens in two phases:
1. **First batch** (for intro): Debug, ResourcesLoader, Quality, Server, Ticker, Time, DayCycles, YearCycles, Inputs, Audio, Notifications, Viewport, Rendering
2. **Second batch** (post-intro): Physics (Rapier), Materials, World, Player, View, all visual systems

### Key Systems

- **Ticker.js**: Central timing system with `elapsed`, `delta`, `deltaScaled`, and TSL uniforms for shaders
- **Physics/**: Rapier 3D physics with custom collision groups (`all`, `object`, `bumper`)
- **Materials.js**: Centralized material management using Three.js TSL (Shading Language) for WebGPU. Materials are stored in `this.list` Map and retrieved via `save()`/`get()` methods. Includes palette texture system and gradient generators
- **Server.js**: WebSocket client using msgpack for binary messaging. Auto-reconnects every 2s if disconnected. UUID-based session management
- **World/**: 43+ world components (Whispers, Leaves, Grass, Water, etc.) that handle environment rendering
- **Inputs/**: Keyboard, gamepad, and touch input handling
- **Cycles/**: DayCycles and YearCycles for time-based environmental changes

### Three.js WebGPU

This project uses Three.js WebGPU renderer (`three/webgpu`), not the classic WebGL renderer:
- Import from `'three/webgpu'` for core classes
- Use TSL (Three Shading Language) for shaders via `'three/tsl'` imports
- Materials use node-based system (e.g., `colorNode`, `positionNode`)
- Renderer setup is async: `await this.rendering.setRenderer()`

### Resource Loading

Resources are loaded via `ResourcesLoader.js` with support for:
- GLTF models (`.glb`)
- KTX2 textures (`.ktx`) with custom properties
- Type system: `'gltf'`, `'textureKtx'`

Format: `[ 'key', 'path', 'type', optionalCallback ]`

## Asset Pipeline

### Blender Export Workflow

1. Mute the palette texture node in Blender (it's loaded/set in Three.js Materials directly)
2. Use corresponding export presets
3. Export without compression (compression is handled by `npm run compress`)

### Compression Script

`npm run compress` processes assets in `static/`:

- **GLB models**: Compresses embedded textures with `etc1s --quality 255` (lossy, GPU-friendly KTX2)
- **Textures** (png/jpg): Compresses to KTX2 format with `--encode etc1s --qlevel 255`
- **UI images** (`static/ui.*`): Converts to WebP
- Generates new files with `-compressed` suffix to preserve originals
- Ignores files already matching `-(draco|ktx|compressed).glb`

Resources: [gltf-transform CLI](https://gltf-transform.dev/cli) | [KTX-Software](https://github.com/KhronosGroup/KTX-Software)

## Code Structure

```
sources/
├── index.js              # Entry point, imports Game
├── Game/
│   ├── Game.js           # Singleton bootstrapper
│   ├── Ticker.js         # Timing/game loop controller
│   ├── Server.js         # WebSocket multiplayer client
│   ├── Player.js         # Player controller
│   ├── Materials.js      # Material management (TSL-based)
│   ├── Physics/          # Rapier physics integration
│   ├── World/            # Environment components (43 files)
│   ├── Inputs/           # Input handling
│   ├── Cycles/           # Day/Year cycle systems
│   ├── Passes/           # Rendering passes
│   ├── Materials/        # Custom material classes
│   ├── Geometries/       # Custom geometries
│   └── utilities/        # Helper functions
├── style/                # Stylus stylesheets
└── data/                 # Static data files

static/                   # Assets (models, textures, audio, UI)
scripts/compress.js       # Asset compression automation
```

## Important Patterns

### Singleton Access
```javascript
import { Game } from './Game.js'
this.game = Game.getInstance()
```

### Ticker Registration
```javascript
this.game.ticker.events.on('tick', () => {
    this.update()
}, priority) // priority determines execution order (see game loop)
```

### Material Creation
Materials should extend `MeshDefaultMaterial` and use TSL nodes. Register via `this.game.materials.save(key, material)`.

### Physics Bodies
Use collision groups and categories defined in `Physics.js`:
```javascript
this.game.physics.categories.floor
this.game.physics.categories.object
this.game.physics.categories.bumper
```

## Dependencies

- **Three.js**: Custom build from GitHub commit (WebGPU renderer)
- **Rapier3D**: Physics engine (accessed via `this.game.RAPIER`)
- **GSAP**: Animation library
- **Vite**: Build tool with plugins for WASM, top-level await, node polyfills
- **msgpack-lite**: Binary serialization for server communication
- **Howler**: Audio playback
- **Tweakpane**: Debug UI

## Multiplayer

The Server.js WebSocket client:
- Connects to `VITE_SERVER_URL` if provided
- Uses msgpack for efficient binary messaging
- Auto-reconnects on disconnect
- Session identified by UUID in localStorage
- Triggers `'connected'` event on connection
