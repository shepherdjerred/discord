export function logErrors(fn: () => unknown) {
  return () => {
    try {
      fn();
    } catch (e) {
      console.error(e);
    }
  };
}
