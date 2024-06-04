import { Stack, Chip } from '@mui/material';
import { FC } from 'react';

import { useMainStore } from 'store';
import { SPACING_GAP } from 'types';
import { FieldSet } from 'components/FieldSet';
import { formatLabel } from 'utils';

interface ChildCoversOfGroupProps {
  groupId: string;
  onChange: (id1: string, id2: string) => void;
}

export const ChildCoversOfGroup: FC<ChildCoversOfGroupProps> = ({
  groupId,
  onChange,
}) => {
  const coversInsideGroup = useMainStore((state) =>
    state.getCoversInsideGroup(groupId),
  );

  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );

  if (coversInsideGroup.length === 0) return null;

  return (
    <FieldSet
      direction="row"
      label="Child Covers"
      gap={SPACING_GAP / 2}
      flexWrap="nowrap">
      <Stack direction="row" flexWrap="wrap" gap={SPACING_GAP / 2}>
        {coversInsideGroup.map((cover) => {
          return (
            <Chip
              key={cover.id}
              label={formatLabel(cover.title.text, cover.id)}
              onClick={() => onChange(groupId, cover.id)}
              onDelete={(evt) => {
                evt.preventDefault();
                removeCoverAndRelatedLines(cover.id);
              }}
            />
          );
        })}
      </Stack>
    </FieldSet>
  );
};
