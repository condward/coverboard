import { useParams } from 'react-router-dom';

export const NAME_SPACE = 'coverboard';
export const DEFAULT_KEY = 'default';

export const DEFAULT_STORAGE = NAME_SPACE + ':' + DEFAULT_KEY;

export const addPrefix = (key: string) => NAME_SPACE + ':' + key;

export const haxPrefix = (key: string) => key.includes(NAME_SPACE);

export const removePrefix = (key: string) => key.replace(NAME_SPACE + ':', '');

export const useSaveId = () => {
  const { saveId = DEFAULT_KEY } = useParams();

  return saveId;
};
