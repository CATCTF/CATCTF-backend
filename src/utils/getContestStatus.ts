export const contestStatus = {
  UPCOMING: 0,
  ACTIVE: 1,
  FINISH: 2,
};

export type ContestStatus = typeof contestStatus[keyof typeof contestStatus];

export function getContestStatus(
  startTimestamp: number,
  finishTimestamp: number,
): ContestStatus {
  const KR_TIME_DIFF = 32400000;
  const localDate = new Date();
  const krTimestamp =
    localDate.getTime() +
    localDate.getTimezoneOffset() * 60 * 1000 +
    KR_TIME_DIFF;
  if (krTimestamp < startTimestamp) {
    return contestStatus.UPCOMING;
  } else if (finishTimestamp < krTimestamp) {
    return contestStatus.FINISH;
  }
  return contestStatus.ACTIVE;
}
