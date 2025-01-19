import { useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { ApiKeys } from 'types';

interface CPAkiKeys {
  [ApiKeys.LAST_FM]: string;
  [ApiKeys.RAWG]: string;
  [ApiKeys.TMDB]: string;
}

export const apiKeysAtom = atomWithStorage<CPAkiKeys>('cbApiKeys', {
  [ApiKeys.LAST_FM]: '',
  [ApiKeys.RAWG]: '',
  [ApiKeys.TMDB]: '',
});

export const useResetApiKey = () => {
  const setApIkey = useSetAtom(apiKeysAtom);

  return {
    resetApiKey() {
      setApIkey({
        [ApiKeys.LAST_FM]: '',
        [ApiKeys.TMDB]: '',
        [ApiKeys.RAWG]: '',
      });
    },
  };
};

export const useUpdateApiKey = (apiName: ApiKeys) => {
  const setApIkey = useSetAtom(apiKeysAtom);

  return {
    updateApiKey(key: string) {
      setApIkey((currentKey) => ({
        ...currentKey,
        [apiName]: key,
      }));
    },
  };
};

export const useGetApiKey = (apiName: ApiKeys | null) => {
  const apiKey = useAtomValue(apiKeysAtom);

  return apiName === null ? null : apiKey[apiName];
};
