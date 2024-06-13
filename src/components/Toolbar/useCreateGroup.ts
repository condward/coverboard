import { v4 as uuidv4 } from 'uuid';
import { ZodError } from 'zod';
import { useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { selectedAtom, useMainStore, useToastStore } from 'store';

export const useCreateGroup = () => {
  const addGroups = useMainStore((state) => state.addGroups);
  const groupTitleDir = useMainStore((state) => state.configs.groups.title.dir);
  const groupSubTitleDir = useMainStore(
    (state) => state.configs.groups.subtitle.dir,
  );
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);
  const id = uuidv4();
  const setSelected = useSetAtom(selectedAtom);

  return {
    createGroup: useCallback(() => {
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
      id,
      setSelected,
      showErrorMessage,
    ]),
  };
};
