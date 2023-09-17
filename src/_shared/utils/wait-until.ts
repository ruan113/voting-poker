import { delay } from './delay';

export async function waitUntil(
  getValueFn: () => boolean | Promise<Boolean>,
  expectedValue: boolean,
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const maxTries = 10;
    for (let i = 1; i <= maxTries; i++) {
      const value = await getValueFn();
      if (value === expectedValue) {
        resolve(undefined);
      }
      await delay(1000);
    }
    reject('Timeout on readyToCall');
  });
}
