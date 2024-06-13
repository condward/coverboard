export enum ToolConfigIDs {
  SEARCH = 'search',
  CONFIG = 'config',
  DELETE = 'delete',
  SHARE = 'share',
  UNDO = 'undo',
  GROUP = 'group',
  SCREENSHOT = 'screenshot',
}

export interface ToolConfig {
  id: ToolConfigIDs;
  tooltip: string;
  color: string;
  emoji: string;
  value: boolean;
  valueModifier: (arg: boolean) => void;
  badge: number | null;
  enabled: boolean;
  shortcut: string;
}
