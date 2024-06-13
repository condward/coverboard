import { Stack, Chip } from '@mui/material';
import { LinkOutlined } from '@mui/icons-material';
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

  const removeCoverAndRelatedArrows = useMainStore(
    (state) => state.removeCoverAndRelatedArrows,
  );

  if (coversInsideGroup.length === 0) return null;

  return (
    <FieldSet
      direction="column"
      label={`Child Covers (${coversInsideGroup.length})`}
      gap={SPACING_GAP}
      flexWrap="nowrap">
      <Stack direction="row" flexWrap="wrap" gap={SPACING_GAP / 2}>
        {coversInsideGroup.map((cover) => {
          return (
            <Chip
              key={cover.id}
              icon={<LinkOutlined />}
              component="a"
              label={formatLabel(cover.title.text, cover.id)}
              onClick={() => onChange(groupId, cover.id)}
              onDelete={(evt) => {
                evt.preventDefault();
                removeCoverAndRelatedArrows(cover.id);
              }}
            />
          );
        })}
      </Stack>
    </FieldSet>
  );
};
