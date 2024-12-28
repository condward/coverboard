import { v4 as uuidv4 } from 'uuid';

import { useShallowMainStore } from 'store';
import { CoverLabelValues } from 'types';

export const useAddEmptyCover = () => {
  const { starsDir, labelDir, labelSubDir, addCovers } = useShallowMainStore(
    (state) => ({
      starsDir: state.configs.covers.rating.dir,
      labelDir: state.configs.covers.title.dir,
      labelSubDir: state.configs.covers.subtitle.dir,
      addCovers: state.addCovers,
    }),
  );

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
          dir: labelSubDir,
        },
        star: {
          dir: starsDir,
          count: 0,
        },
      })),
    );
  };
};
