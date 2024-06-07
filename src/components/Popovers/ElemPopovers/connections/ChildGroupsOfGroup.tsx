import { Stack, Chip } from '@mui/material';
import { LinkOutlined } from '@mui/icons-material';
import { FC } from 'react';

import { useMainStore } from 'store';
import { SPACING_GAP } from 'types';
import { FieldSet } from 'components/FieldSet';
import { formatLabel } from 'utils';

interface ChildGroupsOfGroupProps {
  groupId: string;
  onChange: (id1: string, id2: string) => void;
}

export const ChildGroupsOfGroup: FC<ChildGroupsOfGroupProps> = ({
  groupId,
  onChange,
}) => {
  const groupsInsideGroup = useMainStore((state) =>
    state.getGroupsInsideGroup(groupId),
  );

  const removeGroupAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );

  if (groupsInsideGroup.length === 0) return null;

  return (
    <FieldSet
      direction="row"
      label={`Child Groups (${groupsInsideGroup.length})`}
      gap={SPACING_GAP / 2}
      flexWrap="nowrap">
      <Stack direction="row" flexWrap="wrap" gap={SPACING_GAP / 2}>
        {groupsInsideGroup.map((group) => {
          return (
            <Chip
              key={group.id}
              icon={<LinkOutlined />}
              component="a"
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
