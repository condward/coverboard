export const throttle = (function_: () => void, delay: number) => {
  let inProgress = false;
  return () => {
    if (inProgress) {
      return;
    }
    inProgress = true;
    setTimeout(() => {
      function_();
      inProgress = false;
    }, delay);
  };
};
