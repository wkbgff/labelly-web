/** 시안의 `this._rm = matchMedia('(prefers-reduced-motion: reduce)').matches` 분기를 그대로 대체. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
