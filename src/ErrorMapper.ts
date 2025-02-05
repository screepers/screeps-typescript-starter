export const ErrorMapper = {
  wrapLoop<T extends Function>(fn: T): T {
    return ((...args: any[]) => {
      try {
        return fn(...args);
      } catch (e) {
        if (e instanceof Error) {
          console.error(`Error in loop: ${e.message}\n${e.stack}`);
        } else {
          console.error(`Error in loop: ${e}`);
        }
      }
    }) as unknown as T;
  },
};
