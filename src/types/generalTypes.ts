export const PosTypes = {
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top',
  BOTTOM: 'bottom',
} as const;
export type PosTypes = (typeof PosTypes)[keyof typeof PosTypes];

export const LabelTypes = {
  TITLE: 'title',
  SUBTITLE: 'subtitle',
} as const;
export type LabelTypes = (typeof LabelTypes)[keyof typeof LabelTypes];

export const TextTypes = {
  ArrowLABEL: 'Arrowlabel',
} as const;
export type TextTypes = (typeof TextTypes)[keyof typeof TextTypes];
