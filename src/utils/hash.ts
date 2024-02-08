export const clearHash = () =>
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname + window.location.search,
  );

export const setHash = (hash: string) => {
  window.location.hash = hash;
};

export const getHash = () => window.location.hash.split('#').pop();
