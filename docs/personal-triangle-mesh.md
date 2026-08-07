# Personal triangle mesh

The personal page uses a lightweight 2D canvas mesh made from shared vertices. Each vertex follows two slow,
deterministic oscillations, so connected triangles continuously change their angles, area, and orientation without
visual jumps.

The mesh is generated in document coordinates and only the visible viewport slice is drawn. Updating the world offset
on scroll makes the geometry travel with the page while keeping the canvas itself viewport-sized. This avoids the
memory cost and browser dimension limits of a page-height canvas.

Pointer movement and scrolling briefly raise a radial influence field. It fades in from the cursor with a short outward
expansion, then nearby faces, edges, and vertices slowly contract and fade back to their idle palette. Repeated input
continues the current transition instead of restarting it abruptly. A second, tightly bounded hover core keeps only the
vertices directly below the resting cursor illuminated. The canvas never receives pointer events, so links and native
touch scrolling remain unaffected.

Animation stops when the scene is inactive or the page is hidden. Reduced-motion keeps a static mesh, and the display
settings can pause background motion or select the living mesh manually.
