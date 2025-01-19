import { FC } from 'react';

import { Stack } from '@mui/material';

import { useIsLandscape } from 'utils';

import { useShallowMainStore } from 'store';
import { useGetSizesContext } from 'providers';

import {
  SearchButton,
  ConfigButton,
  ShareButton,
  AddGroupButton,
  DeleteButton,
  ScreenshotButton,
  UndoButton,
} from './ToolbarButtons';

export const Toolbar: FC<{
  takeScreenshot: () => void;
}> = ({ takeScreenshot }) => {
  const isLandscape = useIsLandscape();
  const { padding } = useGetSizesContext();

  const { color } = useShallowMainStore((state) => ({
    color: state.getColor(),
  }));

  return (
    <Stack
      direction={isLandscape ? 'column' : 'row'}
      gap={`${padding}px`}
      border={`3px solid ${color}`}
      padding={`${padding}px`}>
      <SearchButton />
      <ConfigButton />
      <ShareButton />
      <AddGroupButton />
      <DeleteButton />
      <ScreenshotButton takeScreenshot={takeScreenshot} />
      <UndoButton />
    </Stack>
  );
};
