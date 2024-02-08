export enum PosTypes {
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
  BOTTOM = 'bottom',
}

export interface DragLimits {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const NAME_SPACE = 'coverboard';

export const DEFAULT_KEY = 'default';

export enum Modes {
  ARROW = '<Create arrow mode>',
}

export const buildTitle = (saveId: string) => {
  return `<edit ${saveId} title>`;
};
