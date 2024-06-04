export const formatLabel = (text: string, id: string) =>
  text != '' ? text : id.slice(0, 8);
