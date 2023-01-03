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
  const score = Math.ceil(
    ((minimumPoint - Number(maximumPoint)) / decay ** 2) * solve_count ** 2 +
      Number(maximumPoint),
  );
  if (score < minimumPoint) return minimumPoint;
  else return score;
}
