import { Stack, Chip } from '@mui/material';
import { LinkOutlined } from '@mui/icons-material';
import { FC } from 'react';

import { useShallowMainStore } from 'store';
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
  const { getGroupsOfGroup, removeGroupAndRelatedArrows } = useShallowMainStore(
    (state) => ({
      getGroupsOfGroup: state.getGroupsOfGroup,
      removeGroupAndRelatedArrows: state.removeGroupAndRelatedArrows,
    }),
  );
  const groupsOutsideGroup = getGroupsOfGroup(groupId);

  if (groupsOutsideGroup.length === 0) return null;

  return (
    <FieldSet
      direction="row"
      label={`Parent Groups (${groupsOutsideGroup.length})`}
      gap={SPACING_GAP / 2}
      flexWrap="nowrap">
      <Stack direction="row" flexWrap="wrap" gap={SPACING_GAP / 2}>
        {groupsOutsideGroup.map((group) => {
          return (
            <Chip
              key={group.id}
              icon={<LinkOutlined />}
              component="a"
              label={formatLabel(group.title.text, group.id)}
              onClick={() => onChange(groupId, group.id)}
              onDelete={(evt) => {
                evt.preventDefault();
                removeGroupAndRelatedArrows(group.id);
              }}
            />
          );
        })}
      </Stack>
    </FieldSet>
  );
};
