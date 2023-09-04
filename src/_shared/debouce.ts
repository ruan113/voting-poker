type DebounceParams = {
  fnName: string;
  callback: () => Promise<void> | void;
  delay: number;
};

export function debounce({ callback, delay, fnName }: DebounceParams) {
  let timeoutId = {};

  return function () {
    clearTimeout(timeoutId[fnName]);

    timeoutId[fnName] = setTimeout(() => {
      callback();
    }, delay);
  };
}
