# Interactive particle background

The university-projects page uses a transparent Three.js canvas behind the normal page content. Particle position and
velocity live in half-float GPU textures. `GPUComputationRenderer` updates both textures with ping-pong render targets,
so JavaScript only updates interaction and timing uniforms per frame.

The velocity shader combines a slow divergence-free curl field with three local pointer forces: radial repulsion,
directional velocity transfer, and a small tangential vortex. Scroll velocity is measured independently and contributes
a damped global impulse, so mobile flicks remain visible even when the browser emits `pointercancel` to begin native
scrolling. The canvas has `pointer-events: none`; it never captures input or blocks browser gestures.

Quality starts at 50,176 particles on suitable desktops, 25,600 on constrained desktops, and 12,544 for coarse-pointer
or low-core devices. Sustained slow frame averages step down both simulation resolution and DPR. Reduced-motion renders
a static initial state, hidden tabs pause rendering, and missing WebGL2 falls back to a CSS background.

Important values are centralized in `app/components/particles/config.ts`. In development, append
`?particlesDebug=1` to `/projects` to show renderer, frame timing, quality, input, and simulation telemetry.
