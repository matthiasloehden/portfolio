# Living Mesh

The personal page uses a lightweight 2D canvas mesh made from shared vertices. Each vertex follows two slow,
deterministic oscillations, so connected triangles continuously change their angles, area, and orientation without
visual jumps.

The mesh uses document coordinates while the canvas remains viewport-sized. Only visible rows plus a 380-pixel buffer
are generated; rows outside that window do not occupy point, edge, or triangle arrays. Global row and column seeds keep
geometry, tones, and animation phases stable whenever the window is rebuilt during scrolling. This avoids both a
page-height canvas and mesh memory that grows with document height.

Pointer movement and scrolling briefly raise a radial influence field. It fades in from the cursor with a short outward
expansion, then nearby faces, edges, and vertices slowly contract and fade back to their idle palette. Repeated input
continues the current transition instead of restarting it abruptly. A second, tightly bounded hover core keeps only the
vertices directly below the resting cursor illuminated. The canvas never receives pointer events, so links and native
touch scrolling remain unaffected.

`MeshBackground.vue` owns input and browser lifecycle, while `MeshRenderer.ts` owns geometry, simulation, drawing, and
viewport windowing. Pointer influence is calculated once per vertex each frame and reused by connected edges and nodes.

Animation stops when the scene is inactive or the page is hidden. Inactive canvases still receive one synchronized
scroll frame so a later crossfade never reveals stale geometry. Reduced motion keeps a static mesh, and the display
settings can select auto, high, medium, or low quality and enable the shared performance overlay.
