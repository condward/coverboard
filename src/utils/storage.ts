import { DEFAULT_KEY, NAME_SPACE } from 'types';

export const DEFAULT_STORAGE = NAME_SPACE + ':' + DEFAULT_KEY;

export const addPrefix = (key: string) => NAME_SPACE + ':' + key;

export const haxPrefix = (key: string) => key.includes(NAME_SPACE);

export const removePrefix = (key: string) => key.replace(NAME_SPACE + ':', '');
