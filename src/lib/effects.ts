export interface EffectCapabilities {
  reducedMotion: boolean;
  coarsePointer: boolean;
  viewportWidth: number;
}

export function shouldRunPointerEffects(value: EffectCapabilities): boolean {
  return (
    !value.reducedMotion && !value.coarsePointer && value.viewportWidth >= 850
  );
}
