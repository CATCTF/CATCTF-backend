interface GetDynamicScore {
  minimumPoint: number;
  maximumPoint: number;
  decay: number;
  point: number;
}

export function getDynamicScore({
  minimumPoint,
  maximumPoint,
  decay,
  point,
}: GetDynamicScore): number {
  return Math.ceil(
    ((minimumPoint - maximumPoint) / decay ** 2) * point ** 2 + maximumPoint,
  );
}
