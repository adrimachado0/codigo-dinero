/**
 * Decorative motion (marquees, spins, particle sphere) always runs, also with the OS
 * "reduce motion" setting: the site owner's choice (see docs/PENDIENTES.md).
 *
 * The visual regression tests set `window.__FREEZE_MOTION__` before the page loads so every
 * capture is the static first frame.
 */
export function isMotionFrozen(): boolean {
  return typeof window !== "undefined" && "__FREEZE_MOTION__" in window;
}
