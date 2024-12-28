import { ReactNode } from 'react';

export enum ToolConfigIDs {
  SEARCH = 'search',
  CONFIG = 'config',
  DELETE = 'delete',
  SHARE = 'share',
  UNDO = 'undo',
  GROUP = 'group',
  SCREENSHOT = 'screenshot',
}

export enum KeyboardShortcuts {
  SEARCH = 'a',
  SCREENSHOT = 'c',
  DELETE = 'd',
  FIT_SCREEN = 'f',
  GROUP = 'g',
  HIDE_TOOLBAR = 'h',
  NEXT = 'n',
  CONFIG = 'o',
  PREV = 'p',
  SHARE = 's',
  TITLE = 't',
  UNDO = 'u',
}

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
