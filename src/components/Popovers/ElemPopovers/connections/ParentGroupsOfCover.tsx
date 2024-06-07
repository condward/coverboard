import { Stack, Chip } from '@mui/material';
import { LinkOutlined } from '@mui/icons-material';
import { FC } from 'react';

import { useMainStore } from 'store';
import { SPACING_GAP } from 'types';
import { FieldSet } from 'components/FieldSet';
import { formatLabel } from 'utils';

interface ParentGroupsOfCoverProps {
  coverId: string;
  onChange: (id1: string, id2: string) => void;
}

export const ParentGroupsOfCover: FC<ParentGroupsOfCoverProps> = ({
  coverId,
  onChange,
}) => {
  const groupsOfCover = useMainStore((state) =>
    state.getGroupsOfCover(coverId),
  );
  const removeGroupAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );

  if (groupsOfCover.length === 0) return null;

  return (
    <FieldSet
      direction="row"
      label={`Parent Groups (${groupsOfCover.length})`}
      gap={SPACING_GAP / 2}
      flexWrap="nowrap">
      <Stack direction="row" flexWrap="wrap" gap={SPACING_GAP / 2}>
        {groupsOfCover.map((group) => {
          return (
            <Chip
              icon={<LinkOutlined />}
              component="a"
              key={group.id}
              label={formatLabel(group.title.text, group.id)}
              onClick={() => onChange(coverId, group.id)}
              onDelete={(evt) => {
                evt.preventDefault();
                removeGroupAndRelatedLines(group.id);
              }}
            />
          );
        })}
      </Stack>
    </FieldSet>
  );
};
