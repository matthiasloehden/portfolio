# Interactive particle background

The academic page uses a transparent, GPU-accelerated particle field behind the normal page content. Position and
velocity are updated on the GPU, while JavaScript supplies timing and normalized interaction data.

## Runtime structure

- `ParticleBackground.vue` owns Vue props, browser lifecycle, adaptive performance, and failure recovery.
- `InteractionManager.ts` normalizes pointer, click, touch, and scroll input and decays each channel independently.
- `ParticleRenderer.ts` owns the camera, scene, quality changes, and the public renderer contract.
- `ParticleSimulation.ts` owns GPGPU textures, particle geometry, shader uniforms, and simulation resources.
- `ThreeBackgroundRenderer.ts` provides the WebGL2/Three.js setup shared with Wave Grid.

The velocity shader combines a slow curl field with radial pointer repulsion, directional velocity transfer, and a
tangential vortex. Clicking applies a short attraction impulse. Scroll velocity contributes a damped global impulse,
including on touch devices where native scrolling may cancel pointer input. The canvas uses `pointer-events: none`, so it
never blocks links or browser gestures.

## Performance and fallback behavior

The high, medium, and low presets use 50,176, 25,600, and 12,544 particles respectively. Auto mode selects an initial
preset from viewport, pointer, and CPU hints, then steps down after sustained slow frame windows. Each preset also caps
the device pixel ratio.

Reduced motion produces a static frame, hidden tabs stop rendering, and inactive scenes stay mounted but pause their
loop for flash-free background changes. WebGL context loss shows the CSS fallback and recreates the renderer after
restoration. The settings panel can select a fixed preset or auto mode and enable the shared performance overlay.

Configuration lives in `app/components/backgrounds/particles/config.ts`; shader source lives in the adjacent
`shaders.ts` file.
