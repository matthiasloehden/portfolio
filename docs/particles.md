# Interactive particle background

The personal page uses a transparent, GPU-accelerated particle field behind the normal page content. Position and
velocity are updated on the GPU, while JavaScript supplies timing and normalized interaction data.

## Runtime structure

- `ParticleBackground.vue` owns Vue props, browser lifecycle, adaptive performance, and failure recovery.
- `InteractionManager.ts` normalizes pointer, click, touch, and scroll input and decays each channel independently.
- `ParticleRenderer.ts` owns the camera, scene, particle-count rebuilds, and the public renderer contract.
- `ParticleSimulation.ts` owns GPGPU textures, particle geometry, shader uniforms, and simulation resources.
- `ThreeBackgroundRenderer.ts` provides the WebGL2/Three.js setup shared with Wave Grid.
- `config/backgrounds/definitions/particles.ts` defines public controls, defaults, performance values, and runtime limits.

The velocity shader combines a slow curl field with radial pointer repulsion, directional velocity transfer, and a
tangential vortex. Clicking applies a short attraction impulse. Scroll velocity contributes a damped global impulse,
including on touch devices where native scrolling may cancel pointer input. The canvas uses `pointer-events: none`, so it
never blocks links or browser gestures. An optional boundary-collision mode reflects particles at the visible viewport
edges; the default mode continues to wrap them in a slightly larger simulation area.

## Performance and fallback behavior

The high, medium, and low presets use 50,176, 25,600, and 12,544 particles respectively. The particle-count setting can
override these values and rebuilds the square GPGPU state texture when changed. Auto mode selects an initial
preset from viewport, pointer, and CPU hints, then steps down after sustained slow frame windows. Performance-aware
public settings such as the pixel-ratio cap follow that preset unless a visitor has overridden the field.

Reduced motion produces a static frame, hidden tabs stop rendering, and inactive scenes stay mounted but pause their
loop for flash-free background changes. WebGL context loss shows the CSS fallback and recreates the renderer after
restoration. The settings panel can select a fixed preset or auto mode and enable the shared performance overlay.

Internal configuration lives in `config.ts`, editable values live in the background settings definition, and shader
source lives in the adjacent `shaders.ts` file.
