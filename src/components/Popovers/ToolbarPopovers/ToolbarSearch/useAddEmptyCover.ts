import { v4 as uuidv4 } from 'uuid';

import { useMainStore } from 'store';
import { CoverLabelValues } from 'types';

export const useAddEmptyCover = () => {
  const starsDir = useMainStore((state) => state.configs.dir.stars);
  const labelDir = useMainStore((state) => state.configs.dir.covers);
  const addCovers = useMainStore((state) => state.addCovers);

  return (failedCovers: CoverLabelValues) => {
    addCovers(
      failedCovers.map((filteredResult) => ({
        id: uuidv4(),
        link: '',
        pos: {
          x: 0,
          y: 0,
        },
        title: {
          search: filteredResult.title,
          text: filteredResult.title,
          dir: labelDir,
        },
        subtitle: {
          search: filteredResult.subtitle,
          text: filteredResult.subtitle,
          dir: labelDir,
        },
        star: {
          dir: starsDir,
          count: 0,
        },
      })),
    );
  };
};
