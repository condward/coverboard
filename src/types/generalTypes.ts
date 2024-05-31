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

export enum LabelTypes {
  TITLE = 'title',
  SUBTITLE = 'subtitle',
}

export enum TextTypes {
  LINELABEL = 'linelabel',
}
