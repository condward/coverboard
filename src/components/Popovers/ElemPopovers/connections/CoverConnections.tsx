import { Stack } from '@mui/material';
import { FC } from 'react';

import { SPACING_GAP } from 'types';
import { useShallowMainStore } from 'store';

import { NavigationBar } from './NavigationBar';
import { ArrowsOfCoverOrigin } from './ArrowsOfCoverOrigin';
import { ArrowsOfCoverTarget } from './ArrowsOfCoverTarget';
import { ArrowsOfGroupOrigin } from './ArrowsOfGroupOrigin';
import { ArrowsOfGroupTarget } from './ArrowsOfGroupTarget';
import { ParentGroupsOfCover } from './ParentGroupsOfCover';

interface CoverConnectionsProps {
  coverId: string;
  onChange: (id1: string, id2: string) => void;
}

export const CoverConnections: FC<CoverConnectionsProps> = ({
  coverId,
  onChange,
}) => {
  const { getCovers, coverIdx } = useShallowMainStore((state) => ({
    getCovers: state.getCovers,
    coverIdx: state.covers.findIndex((cover) => cover.id === coverId),
  }));
  const covers = getCovers();

  const prevCover = coverIdx > 0 ? covers[coverIdx - 1] : undefined;
  const nextCover =
    coverIdx < covers.length - 1 ? covers[coverIdx + 1] : undefined;

  return (
    <Stack gap={SPACING_GAP}>
      <NavigationBar
        id={coverId}
        onChange={onChange}
        prev={
          prevCover
            ? {
                id: prevCover.id,
                title: prevCover.title.text,
              }
            : undefined
        }
        next={
          nextCover
            ? {
                id: nextCover.id,
                title: nextCover.title.text,
              }
            : undefined
        }
      />
      <ParentGroupsOfCover coverId={coverId} onChange={onChange} />
      <ArrowsOfCoverOrigin id={coverId} onChange={onChange} />
      <ArrowsOfCoverTarget id={coverId} onChange={onChange} />
      <ArrowsOfGroupOrigin id={coverId} onChange={onChange} />
      <ArrowsOfGroupTarget id={coverId} onChange={onChange} />
    </Stack>
  );
};
