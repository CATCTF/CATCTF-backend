interface GetDynamicScore {
  minimumPoint: number;
  maximumPoint: number;
  decay: number;
  solve_count: number;
}

export function getDynamicScore({
  minimumPoint,
  maximumPoint,
  decay,
  solve_count,
}: GetDynamicScore): number {
  return Math.ceil(
    ((minimumPoint - Number(maximumPoint)) / decay ** 2) * solve_count ** 2 +
      Number(maximumPoint),
  );
}
