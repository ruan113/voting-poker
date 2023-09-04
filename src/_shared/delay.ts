export function delay(miliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, miliseconds);
  });
}
