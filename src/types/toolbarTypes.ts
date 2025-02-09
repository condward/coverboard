import { ReactNode } from 'react';

export const ToolConfigIDs = {
  SEARCH: 'search',
  CONFIG: 'config',
  DELETE: 'delete',
  SHARE: 'share',
  UNDO: 'undo',
  GROUP: 'group',
  SCREENSHOT: 'screenshot',
} as const;
export type ToolConfigIDs = (typeof ToolConfigIDs)[keyof typeof ToolConfigIDs];

export const KeyboardShortcuts = {
  SEARCH: 'a',
  SCREENSHOT: 'c',
  DELETE: 'd',
  FIT_SCREEN: 'f',
  GROUP: 'g',
  HIDE_TOOLBAR: 'h',
  NEXT: 'n',
  CONFIG: 'o',
  PREV: 'p',
  SHARE: 's',
  TITLE: 't',
  UNDO: 'u',
} as const;
export type KeyboardShortcuts =
  (typeof KeyboardShortcuts)[keyof typeof KeyboardShortcuts];

export interface ToolConfig {
  id: ToolConfigIDs;
  tooltip: string;
  color: string;
  icon: ReactNode;
  value: boolean;
  valueModifier: (arg: boolean) => void;
  badge: number | string | null;
  enabled: boolean;
  shortcut: KeyboardShortcuts;
}
