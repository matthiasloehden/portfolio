export type PortSide = "top" | "right" | "bottom" | "left"

export interface CoolingPortDefinition {
  id: string
  side: PortSide
  offset?: number
  className?: string
}

export interface TubeConnection {
  from: string
  to: string

  /**
   * direct:
   *   Draw directly between both ports.
   *
   * x:
   *   Move to a shared X coordinate first.
   *
   * y:
   *   Move to a shared Y coordinate first.
   */
  axis?: "direct" | "x" | "y"

  /**
   * Coordinate in the 1000 × 700 design space.
   * If omitted, the midpoint is used.
   */
  at?: number
}
