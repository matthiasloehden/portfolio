# Background architecture

The portfolio has four ambient scenes:

| Scene | Renderer | Description | Details |
| --- | --- | --- | --- |
| Wave Grid | WebGL2 | Interactive line grid | [Wave Grid](waves.md) |
| Particles | WebGL2 | GPU-accelerated particle field | [Particles](particles.md) |
| Triangles | Canvas2D | Animated geometric pattern | [Triangles](triangles.md) |
| Living Mesh | Canvas2D | Animated connected mesh | [Living Mesh](living-mesh.md) |

## Ownership boundaries

Each scene follows the same three-part structure:

1. `*Background.vue` owns reactive props, browser input, mount/unmount behavior, and performance-mode changes.
2. `*Renderer.ts` owns drawing resources, theme application, resizing, diagnostics, and scene-specific rendering.
3. `config.ts` and `types.ts` contain validated constants and scene-specific TypeScript contracts.

Renderers implement the shared `BackgroundRendererContract`, which requires typed theme updates and base diagnostics.
Every quality preset extends `BackgroundQualityPreset`, so `id`, slow-frame threshold, and pixel-ratio cap cannot drift
between scenes. Specialized values such as particle resolution or mesh spacing remain local.

The system uses composition rather than a renderer base class. Canvas2D, shader lines, and GPGPU simulations do not
share meaningful resource creation or frame APIs. Small shared controllers capture the behavior that is genuinely
identical:

| Shared module | Responsibility |
| --- | --- |
| `BackgroundEnvironment` | Theme, reduced-motion, and document-visibility signals |
| `BackgroundPerformanceRuntime` | Preset selection, frame sampling, and normalized overlay data |
| `BackgroundResizeController` | Element, viewport, orientation, and DPR-sensitive resize signals |
| `AnimationFrameScheduler` | A single pending RAF slot for Canvas2D scenes |
| `ThreeBackgroundRenderer` | WebGL2 context creation and common Three.js renderer ownership |
| `WebGLContextLifecycle` | Context-loss detection and renderer recreation callbacks |
| `useBackgroundCanvas` | Reactive canvas and fallback error state |

## Orchestration and transitions

`BackgroundOrchestrator.vue` resolves the active scene from the route and saved preference. All four components remain
mounted because destroying and recreating a canvas can produce an empty white frame. CSS opacity performs the crossfade,
while inactive scenes stop continuous rendering. Scroll-dependent Canvas2D scenes still draw a cheap synchronization
frame so their first visible frame is current.

Animation channels are independent: idle motion, cursor movement, cursor click, and scroll response can each be
disabled. `prefers-reduced-motion` suppresses motion at the shared environment boundary without changing saved user
preferences.

## Adaptive quality and diagnostics

Every scene defines high, medium, and low presets. Auto mode chooses an initial level from coarse-pointer, viewport, and
hardware-concurrency hints. `AdaptivePerformanceManager` samples sustained frame windows and only steps downward after
repeated slow results; it does not oscillate quality during short frame spikes.

The shared overlay receives normalized resolution, DPR, mode, preset, FPS, and frame time fields. Each renderer adds a
small set of scene-specific diagnostics. Inactive scene frames are excluded from adaptive measurements.
