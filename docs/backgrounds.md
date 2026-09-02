# Background architecture

The portfolio has four ambient scenes:

| Scene | Renderer | Description | Details |
| --- | --- | --- | --- |
| Wave Grid | WebGL2 | Interactive line grid | [Wave Grid](waves.md) |
| Particles | WebGL2 | GPU-accelerated particle field | [Particles](particles.md) |
| Triangles | Canvas2D | Animated geometric pattern | [Triangles](triangles.md) |
| Living Mesh | Canvas2D | Animated connected mesh | [Living Mesh](living-mesh.md) |

## Ownership boundaries

Each scene follows the same four-part structure:

1. `*Background.vue` owns reactive props, browser input, mount/unmount behavior, and performance-mode changes.
2. `*Renderer.ts` owns drawing resources, theme application, resizing, diagnostics, and scene-specific rendering.
3. `config/backgrounds/definitions/*.ts` declares public defaults, editor metadata, performance values, and renderer safety limits.
4. `config.ts` and `types.ts` contain internal constants and scene-specific TypeScript contracts.

Renderers implement the shared `BackgroundRendererContract`, which requires typed theme updates and base diagnostics.
Every quality preset extends `BackgroundQualityPreset`, so its ID and slow-frame threshold cannot drift between scenes.
Specialized internal values such as particle simulation resolution remain local.

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

## Settings flow

[`settingsRegistry.ts`](../app/config/backgrounds/settingsRegistry.ts) is the code entry point for configurable
background behavior. It combines the four scene-owned definitions behind one typed API. The display editor, persistence
adapter, and scene controllers all consume that API rather than maintaining parallel control lists, defaults, and
validators.

Only values explicitly changed by a visitor are persisted. An effective value is resolved in this order:

1. An explicit visitor override.
2. The active high, medium, or low performance value, when the setting defines one.
3. The scene default.

The number editor deliberately permits experimental values outside its recommended slider range. Before a value reaches
a renderer, the registry applies a separate, wider runtime safety range. This keeps the interface flexible without
allowing invalid geometry sizes, texture capacities, or render resolutions.

The slider keeps the recommended range visually prominent and uses its remaining width for more extreme values. When a
runtime boundary removes one extreme side, that space is reassigned to the other side. Performance values remain
independent markers; the active preset and all concrete preset values are shown without redefining what is recommended.
Boolean scene settings use accessible switches and follow the same override, persistence, and reset flow.

Display preferences are written as one versioned document by
[`displayPreferencesStorage.ts`](../app/utils/displayPreferencesStorage.ts). It validates untrusted browser storage and
migrates the earlier multi-key settings format once. Vue state and DOM effects remain isolated in
[`useDisplayPreferences.ts`](../app/composables/useDisplayPreferences.ts).

## Orchestration and transitions

`useDisplayPreferences.ts` resolves the active scene from the route and saved preference. Automatic selection follows the
current page; random selection draws one of the four scenes and stays stable until it is selected again or navigation
changes the page. `BackgroundOrchestrator.vue` presents that resolved scene. The active async scene loads with hydration.
After the initial page has painted, Nuxt lazy-loads and mounts the remaining scenes through a shared idle queue. The queue
waits for one scene to finish its initial setup before scheduling the next idle mount, avoiding overlapping Canvas or
WebGL initialization phases on the main thread. All four then remain mounted because destroying and recreating a canvas
can produce an empty white frame. CSS opacity performs the crossfade, while inactive scenes stop continuous rendering.
Scroll-dependent Canvas2D scenes still draw a cheap synchronization frame so their first visible frame is current.

Animation channels are independent: idle motion, cursor movement, cursor click, and scroll response can each be
disabled. `prefers-reduced-motion` suppresses motion at the shared environment boundary without changing saved user
preferences.

## Adaptive quality and diagnostics

Every scene defines high, medium, and low presets. Auto mode chooses an initial level from coarse-pointer, viewport, and
hardware-concurrency hints. `AdaptivePerformanceManager` samples sustained frame windows and only steps downward after
repeated slow results; it does not oscillate quality during short frame spikes.

Performance-aware public settings follow the same precedence rule described above. Changing the performance mode updates
their controls immediately unless the visitor has explicitly overridden a field. Thin slider markers show the available
low, medium, and high values, and the field reset returns control to the performance system.

The shared overlay receives normalized resolution, DPR, mode, preset, FPS, and frame time fields. Each renderer adds a
small set of scene-specific diagnostics. Inactive scene frames are excluded from adaptive measurements.
