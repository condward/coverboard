import { Stack } from '@mui/material';
import { FC } from 'react';

import { SPACING_GAP } from 'types';
import { useMainStore } from 'store';

import { NavigationBar } from './NavigationBar';
import { LinesOfCoverOrigin } from './LinesOfCoverOrigin';
import { LinesOfCoverTarget } from './LinesOfCoverTarget';
import { LinesOfGroupOrigin } from './LinesOfGroupOrigin';
import { LinesOfGroupTarget } from './LinesOfGroupTarget';
import { ParentGroupsOfCover } from './ParentGroupsOfCover';

interface CoverConnectionsProps {
  coverId: string;
  onChange: (id1: string, id2: string) => void;
}

export const CoverConnections: FC<CoverConnectionsProps> = ({
  coverId,
  onChange,
}) => {
  const coverIdx = useMainStore((state) =>
    state.covers.findIndex((cov) => cov.id === coverId),
  );
  const covers = useMainStore((state) => state.covers);
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
      <LinesOfCoverOrigin id={coverId} onChange={onChange} />
      <LinesOfCoverTarget id={coverId} onChange={onChange} />
      <LinesOfGroupOrigin id={coverId} onChange={onChange} />
      <LinesOfGroupTarget id={coverId} onChange={onChange} />
    </Stack>
  );
};
