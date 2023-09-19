export function addSecondsToDate(date: Date, secondsToAdd: number): Date {
  const result = new Date(date);
  result.setSeconds(date.getSeconds() + secondsToAdd);
  return result;
}
