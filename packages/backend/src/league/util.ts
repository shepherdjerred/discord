export function logErrors(fn: () => Promise<unknown>) {
  return async () => {
    try {
      await fn();
    } catch (e) {
      console.error(e);
    }
  };
}
