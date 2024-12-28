import { v4 as uuidv4 } from 'uuid';
import { ZodError } from 'zod';
import { useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { selectedAtom, useShallowMainStore, useToastStore } from 'store';

export const useCreateGroup = () => {
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);
  const setSelected = useSetAtom(selectedAtom);

  const { groupTitleDir, groupSubTitleDir, addGroups } = useShallowMainStore(
    (state) => ({
      groupTitleDir: state.configs.groups.title.dir,
      groupSubTitleDir: state.configs.groups.subtitle.dir,
      addGroups: state.addGroups,
    }),
  );

  return {
    createGroup: useCallback(() => {
      const id = uuidv4();
      try {
        addGroups([
          {
            id,
            pos: {
              x: 0,
              y: 0,
            },
            title: { text: '', dir: groupTitleDir },
            subtitle: { text: '', dir: groupSubTitleDir },
            scale: {
              x: 3,
              y: 3,
            },
          },
        ]);
        setSelected({ id, open: false });
      } catch (error) {
        if (error instanceof ZodError) {
          const tooBig = error.issues.find((msg) => msg.code === 'too_big');

          if (tooBig) {
            showErrorMessage(tooBig.message);
            return;
          }
          showErrorMessage('Bad formatted group');
          return;
        }
        throw error;
      }
    }, [
      addGroups,
      groupSubTitleDir,
      groupTitleDir,
      setSelected,
      showErrorMessage,
    ]),
  };
};
