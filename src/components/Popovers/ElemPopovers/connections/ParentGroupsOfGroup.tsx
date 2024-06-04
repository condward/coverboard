import { Stack, Chip } from '@mui/material';
import { FC } from 'react';

import { useMainStore } from 'store';
import { SPACING_GAP } from 'types';
import { FieldSet } from 'components/FieldSet';
import { formatLabel } from 'utils';

interface ParentGroupsOfGroupProps {
  groupId: string;
  onChange: (id1: string, id2: string) => void;
}

export const ParentGroupsOfGroup: FC<ParentGroupsOfGroupProps> = ({
  groupId,
  onChange,
}) => {
  const groupsOutsideGroup = useMainStore((state) =>
    state.getGroupsOfGroup(groupId),
  );
  const removeGroupAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );

  if (groupsOutsideGroup.length === 0) return null;

  return (
    <FieldSet
      direction="row"
      label="Parent Groups"
      gap={SPACING_GAP / 2}
      flexWrap="nowrap">
      <Stack direction="row" flexWrap="wrap" gap={SPACING_GAP / 2}>
        {groupsOutsideGroup.map((group) => {
          return (
            <Chip
              key={group.id}
              label={formatLabel(group.title.text, group.id)}
              onClick={() => onChange(groupId, group.id)}
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
