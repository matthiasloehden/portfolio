# Triangles

The work page uses an animated Canvas2D triangle pattern. Pointer movement draws a short highlight trail, clicks create
a focused pulse, and scrolling keeps the interaction aligned with page content.

## Runtime structure

- `TriangleBackground.vue` owns Vue props, browser events, lifecycle, and frame scheduling.
- `TriangleRenderer.ts` owns grid generation, pointer projection, drawing, and Canvas2D resources.
- `config.ts` defines visual behavior and high, medium, and low quality presets.

The renderer generates only the geometry required around the viewport. Stable seeds ensure that regenerated tiles keep
the same appearance while the page moves. Reusable Canvas paths avoid rebuilding identical triangle shapes per tile.

Reduced motion preserves the composition without continuous animation. Inactive scenes pause their loop but remain
mounted so switching backgrounds does not introduce an empty frame.
