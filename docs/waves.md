# Wave Grid

The home page uses an interactive WebGL line grid behind the main content. Slow shader motion keeps the scene alive,
while pointer movement, clicks, touch gestures, and scrolling create fading ripples.

## Runtime structure

- `WaveBackground.vue` owns Vue props, browser events, lifecycle, and adaptive performance.
- `WaveRenderer.ts` owns the Three.js scene, line geometry, shader material, and drawing resources.
- `geometry.ts` builds the configurable grid lines.
- `shaders.ts` contains the visual motion and interaction response.

Pointer samples are stored as a short trail and uploaded to the shader in one compact texture. Settings that affect
geometry rebuild the lines; theme and motion changes only update existing shader state.

High, medium, and low presets adjust line detail, trail capacity, and pixel ratio. Reduced motion keeps a static frame,
hidden tabs pause rendering, and WebGL context loss activates the CSS fallback until resources are restored.

Configuration and preset values live in `app/components/backgrounds/waves/config.ts`.
